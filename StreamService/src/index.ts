import express from 'express'
const app = express()
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Config } from './config';
import { Config_Kurento } from './config_kurento';
import { Server } from "socket.io";
const { types, createWorker } = require("mediasoup");
import cors from 'cors';
const https = require('httpolyglot');
import fs from 'fs'
import path from 'path'
import { io } from "socket.io-client";
const { spawn } = require('node:child_process');
const SdpTransform = require("sdp-transform");
const KurentoClient = require("kurento-client");
const __dirname = path.resolve()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/sfu/:room', express.static(path.join(__dirname, 'public')))
const Corsoptions: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
    'Access-Control-Allow-Origin'
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: "*",
  preflightContinue: false,
};
app.use(cors(Corsoptions));
// socket.io namespace (could represent a room?)
//Check to make sure header is not undefined, if so, return Forbidden (403)
let sslConfig = new Config();
let kurentoConfig = new Config_Kurento();
const options = {
  key: fs.readFileSync(sslConfig.SSLKey, 'utf-8'),
  cert: fs.readFileSync(sslConfig.SSLCert, 'utf-8')
}
const httpsServer = https.createServer(options, app)
httpsServer.listen(3000, "0.0.0.0", () => {
  console.log('listening on port: ' + 3000)
})
let ioServer = new Server(httpsServer, { 
  cors: {
    origin: "*",
    credentials: true
  }
});
const connections = ioServer.of('/mediasoup');
let worker!: any;
let rooms: any = {}
let peers: any = {}
let transports: Array<any> = [];
let producers: Array<any> = [];
let consumers: Array<any> = [];
let kurentoClient: any = "";
let kurentoPipeline: any = "";
let kmsRtpEndpoint: any = "";
const CryptoSuite = "AES_CM_128_HMAC_SHA1_80";
const CryptoSuiteKurento = "AES_128_CM_HMAC_SHA1_80";
const createWorkerFuction = async () => {
  worker = await createWorker({
    rtcMinPort: 2000,
    rtcMaxPort: 2100,
  })
  console.log(`worker pid ${worker.pid}`);
  worker.on('died', (error: any) => {

    console.error('mediasoup worker has died')
    setTimeout(() => process.exit(1), 2000) // exit in 2 seconds
  })

  return worker
}
worker = createWorkerFuction();
const mediaCodecs = [
  {
    kind: 'audio',
    mimeType: 'audio/opus',
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: 'video',
    mimeType: 'video/VP8',
    clockRate: 90000,
    parameters: {
      'x-google-start-bitrate': 1000,
    },
  },
]

const getMsPayloadType = (mimeType: any, roomName: string) => {
  const router = rooms[roomName].router
  let pt = 0;

  const codec = router.rtpCapabilities.codecs.find(
    (c: any) => c.mimeType === mimeType
  );
  if (codec) {
    pt = codec.preferredPayloadType;
  }

  return pt;
}
const getMsHeaderExtId = (kind:any, name:any, roomName: string) => {
  const router = rooms[roomName].router
  let id = 0;

  const ext = router.rtpCapabilities.headerExtensions.find(
    (e: any) => e.kind === kind && e.uri.includes(name)
  );
  if (ext) {
    id = ext.preferredId;
  }

  return id;
}
const startKurento = async () => {
  const kurentoUrl = "ws://52.188.167.23:8888/kurento";
  console.log("[startKurento] Connect with Kurento Media Server:", kurentoUrl);

  kurentoClient = new KurentoClient(kurentoUrl);
  console.log("[startKurento] Kurento client connected");

  kurentoPipeline = await kurentoClient.create("MediaPipeline");
  console.log("[startKurento] Kurento pipeline created");
}
const startKurentoFilter = async () => {
  const kmsPipeline = kurentoPipeline;
  const recvEndpoint = kmsRtpEndpoint;

  const filter = await kmsPipeline.create("GStreamerFilter", {
    command: "videobalance saturation=0.0",
  });

  await recvEndpoint.connect(filter);
}
const createWebRtcTransport = async (router: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const webRtcTransport_options = {
        listenIps: [
          {
            ip: '0.0.0.0',
            announcedIp: '0.0.0.0',
          }
        ],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true
      }
      let transport = await router.createWebRtcTransport(webRtcTransport_options)
      console.log(`transport id: ${transport.id}`)
      transport.on('dtlsstatechange', (dtlsState: any) => {
        if (dtlsState === 'closed') {
          transport.close()
        }
      })
      transport.on('close', () => {
        console.log('transport closed')
      })
      resolve(transport)
    } catch (error) {
      reject(error)
    }
  })
}
const createRoom = async (roomName: any, socketId: any) => {
  let router1
  let peers = []
  if (rooms[roomName]) {
    router1 = rooms[roomName].router
    peers = rooms[roomName].peers || []
  } else {
    router1 = await worker.createRouter({ mediaCodecs, })
  }
  console.log(`Router ID: ${router1.id}`, peers.length)
  rooms[roomName] = {
    router: router1,
    peers: [...peers, socketId],
  }
  return router1
}
const createPlainTransport = async (router: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      let transport = await router.createPlainTransport({
        comedia: false,
        rtcpMux: false,
        enableSrtp: true,
        srtpCryptoSuite: CryptoSuite,
        ...kurentoConfig.Settings.mediasoup.plainTransport
      });
      resolve(transport)
    } catch (error) {
      reject(error)
    }
  })
}
const addTransport = (transport: any, roomName: any, consumer: any, socketId: string) => {
  transports = [
    ...transports,
    { socketId: socketId, transport, roomName, consumer, }
  ]
  peers[socketId] = {
    ...peers[socketId],
    transports: [
      ...peers[socketId].transports,
      transport.id,
    ]
  }
}
const addProducer = (producer: any, roomName: any, socketId: string) => {
  producers = [
    ...producers,
    { socketId: socketId, producer, roomName, }
  ]
  peers[socketId] = {
    ...peers[socketId],
    producers: [
      ...peers[socketId].producers,
      producer.id,
    ]
  }
}

const addConsumer = (consumer: any, roomName: any, remoteSocketId: string) => {
  // add the consumer to the consumers list
  consumers = [
    ...consumers,
    { socketId: remoteSocketId, consumer, roomName, }
  ]

  // add the consumer id to the peers list
  peers[remoteSocketId] = {
    ...peers[remoteSocketId],
    consumers: [
      ...peers[remoteSocketId].consumers,
      consumer.id,
    ]
  }
}
const informConsumers = (roomName: any, socketId: any, id: any) => {
  console.log(`just joined, id ${id} ${roomName}, ${socketId}`)
  /* TODO MAP THIS TO socketId:producer.id HASHMAP */
 // producers.forEach(producerData => {
 //   if (producerData.socketId !== socketId && producerData.roomName === roomName) {
  //    const producerSocket = peers[producerData.socketId].socket
      // use socket to send producer id to producer
     // consumerGatewaySocket.emit('new_producer', { producerId: id, socketId, roomName });
  //  }
 // })
}
///////////////////////////////////
const getTransport = (socketId: any) => {
  const [producerTransport] = transports.filter((transport: any) => transport.socketId === socketId && !transport.consumer)
  return producerTransport.transport
}
//ffmpeg -re -f video4linux2 -i /dev/video0 -vcodec libx264 -vprofile baseline -acodec aac -strict -2 -f flv rtmp://localhost/show/stream
const bindFFmpeg = (streamip: string, streamport: string, sdpData: any, roomName: string) => {
  fs.writeFileSync(streamip + '_' + streamport + '.sdp', sdpData);
  var ffmpeg_args = [
//      '-analyzeduration', '100M', 
//      '-probesize', '100M',
      '-protocol_whitelist', 'file,udp,rtp',
      '-i', path.join(__dirname, streamip + '_' + streamport + '.sdp'),
      '-vcodec', 'copy',
      '-acodec', 'copy',
      '-g', '24',
      '-f', 'flv',
      'rtmp://rtmp.hq.streamlife.is/show/' + roomName
  ].concat();
  var child = spawn('ffmpeg', ffmpeg_args);
  //ignore stdout
  //this.child.stdout.on('data', this.emit.bind(this, 'data'));
  child.stderr.on('data', (data: any) => {
      var _len = data.length;
      var _str;
      if (data[_len - 1] == 13) {
          _str = data.toString().substring(0, _len - 1);
      } else {
          _str = data.toString();
      }
      console.log(_str);
  });

  child.on('error', (err: any) => {
      if (err.code == 'ENOENT') {
      } else {
      }
  });

  child.on('close', (code: any) => {
      if (code === 0) {
      }
  });
  return child;
};


startKurento();
connections.on('connection', async socket => {
  const removeItems = (items: Array<any>, socketId: any, type: any) => {
    items.forEach((item: any) => {
      if (item.socketId === socket.id) {
        item[type].close()
      }
    })
    items = items.filter((item: any) => item.socketId !== socket.id)

    return items
  }
  socket.on('disconnect', () => {
    console.log('peer disconnected')
    consumers = removeItems(consumers, socket.id, 'consumer')
    producers = removeItems(producers, socket.id, 'producer')
    transports = removeItems(transports, socket.id, 'transport')
    console.log("socket.id ", socket.id);
    if (!peers[socket.id]) {
      console.log("peers[socket.id] ", peers[socket.id]);
      return;
    }
    const { roomName } = peers[socket.id]
    delete peers[socket.id]
    // remove socket from room
    rooms[roomName] = {
      router: rooms[roomName].router,
      peers: rooms[roomName].peers.filter((socketId: any) => socketId !== socket.id)
    }
  })
  socket.on('joinRoom', async ({ roomName, socketId }, callback) => {
    let varRtpCapabilities!: any;
    console.log("SOCKET ID ++++" + socketId);
    console.log("ROOM NAME ===== " + roomName);
    if (!peers[socketId]) {
      socket.join(roomName);
      const router1 = await createRoom(roomName, socket.id)
      const rtpCapabilities = router1.rtpCapabilities
      peers[socket.id] = {
        socket,
        roomName,           // Name for the Router this Peer joined
        transports: [],
        producers: [],
        consumers: [],
        peerDetails: {
          name: '',
          isAdmin: false,   // Is this Peer the Admin?
        },
        rtpCapabilities
      }
      console.log("BEFORE ROOM JOINED");
      console.log(peers[socket.id]);
  //  ioServer.sockets.in(roomName).emit("roomJoined", { rtpCapabilities });  
      varRtpCapabilities = rtpCapabilities;
      connections.in(roomName).emit("roomJoined", { rtpCapabilities: varRtpCapabilities });
    } else {
      console.log("socket ::::" + socket.id);
      socket.join(socket.id);
      varRtpCapabilities = peers[socketId].rtpCapabilities;
      const producerId = peers[socketId].producers[0];
      connections.in(socket.id).emit("roomJoined", 
        { 
          rtpCapabilities: varRtpCapabilities,
          socketId,
          producerId
        }
      );
    }
  })
  socket.on('createWebRtcTransport', async ({ consumer , remoteSocketId}, callback) => {
    console.log(`WhAT IS CONSUMER::: ${consumer}`)
    console.log(`WhAT IS SOCKET ID::: ${remoteSocketId}`)
    // get Room Name from Peer's properties
    console.log(peers);
    console.log(socket.id);
    let socketId!:any;
    if (remoteSocketId) { socketId = remoteSocketId; console.log("INSIDE"); } else { socketId = socket.id };
    const roomName = peers[socketId].roomName;
    const router = rooms[roomName].router;
    createWebRtcTransport(router).then(
      (transport: any) => {
        callback({
          params: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
          }
        })
        addTransport(transport, roomName, consumer, socketId);
      },
      error => {
        console.log(error)
      }
    );
  });
  socket.on('createConsumer', async (roomName: string) => {
    const socketId = socket.id;
    const transport:any = await createPlainTransport(rooms[roomName].router);
    addTransport(transport, roomName, true, socketId)
    const msPayloadType = getMsPayloadType("video/VP8", roomName);
    const msHeaderExtId = getMsHeaderExtId("video", "abs-send-time", roomName);

    const kmsRtpCaps = {
      codecs: [
        // RtpCodecCapability (https://mediasoup.org/documentation/v3/mediasoup/rtp-parameters-and-capabilities/#RtpCodecCapability)
        {
          kind: "video",
          mimeType: "video/VP8",
          preferredPayloadType: msPayloadType,
          clockRate: 90000,
          parameters: {},
          rtcpFeedback: [
            { type: "goog-remb" },
            { type: "ccm", parameter: "fir" },
            { type: "nack" },
            { type: "nack", parameter: "pli" },
          ],
        },
      ],
      headerExtensions: [
        {
          kind: "video",
          uri: "http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time",
          preferredId: msHeaderExtId,
          preferredEncrypt: false,
          direction: "sendrecv",
        },
      ],
    };
    console.log(`PRODUCER::::${peers[socketId].producers[0]}`);
    const msConsumer = await transport.consume({
      producerId: peers[socketId].producers[0],
      rtpCapabilities: kmsRtpCaps,
      paused: false,
    });
    console.log(`MSCONSUMER::::${JSON.stringify(msConsumer)}`);
    console.log(roomName);

    const sdpListenIp = transport.tuple.localIp;
    const sdpListenPort = transport.tuple.localPort;
    console.log("SDP LISTEN PORT::::::" + sdpListenPort)
    const sdpListenPortRtcp = transport.rtcpTuple.localPort;

    const sdpSsrc = msConsumer.rtpParameters.encodings[0].ssrc;
    const sdpCname = msConsumer.rtpParameters.rtcp.cname;

    let sdpProtocol = "RTP/AVPF";
    let sdpCryptoLine = "";
    let kmsCrypto = undefined;

    // Use SRTP protocol
    sdpProtocol = "RTP/SAVPF";

    // Kurento uses this to decrypt SRTP/SRTCP coming in from mediasoup
    const keyBase64 = transport.srtpParameters.keyBase64;
    sdpCryptoLine = `a=crypto:2 ${CryptoSuite} inline:${keyBase64}|2^31|1:1\r\n`;

    // Kurento uses this to encrypt SRTCP going out to mediasoup
    kmsCrypto = KurentoClient.getComplexType("SDES")({
      keyBase64: kurentoConfig.Settings.srtp.keyBase64,
      crypto: CryptoSuiteKurento,
    });

    // SDP Offer for Kurento RtpEndpoint
    // prettier-ignore
    const kmsSdpOffer =
      "v=0\r\n" +
      `o=- 0 0 IN IP4 ${sdpListenIp}\r\n` +
      "s=-\r\n" +
      `c=IN IP4 ${sdpListenIp}\r\n` +
      "t=0 0\r\n" +
      `m=video ${sdpListenPort} ${sdpProtocol} ${msPayloadType}\r\n` +
      `a=extmap:${msHeaderExtId} http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n` +
      "a=sendonly\r\n" +
      `a=rtcp:${sdpListenPortRtcp}\r\n` +
      `${sdpCryptoLine}` +
      `a=rtpmap:${msPayloadType} VP8/90000\r\n` +
      `a=rtcp-fb:${msPayloadType} goog-remb\r\n` +
      `a=rtcp-fb:${msPayloadType} ccm fir\r\n` +
      `a=rtcp-fb:${msPayloadType} nack\r\n` +
      `a=rtcp-fb:${msPayloadType} nack pli\r\n` +
      `a=ssrc:${sdpSsrc} cname:${sdpCname}\r\n` +
      "";
    console.log(kmsSdpOffer);
    kmsRtpEndpoint = await kurentoPipeline.create("RtpEndpoint", {
      crypto: kmsCrypto,
    });
    kmsRtpEndpoint.processOffer(kmsSdpOffer, async (error: any, sdpAnswer: any) => {
      if (error) {
        return error;
      }
      console.log('start process on: rtp://' + sdpListenIp + ':' + sdpListenPort);
      console.log('recv sdp answer:', sdpAnswer);
      //var _ffmpeg_child = bindFFmpeg(streamIp, streamPort, sdpRtpOfferString, ws);
//      bindFFmpeg(sdpListenIp, sdpListenPort, kmsSdpOffer, roomName);
      // NOTE: A real application would need to parse this SDP Answer and adapt to
      // the parameters given in it, following the SDP Offer/Answer Model.
      // For example, if Kurento didn't support NACK PLI, then it would reply
      // without that attribute in the SDP Answer, and this app should notice it and
      // reconfigure accordingly.
      // Here, we'll just assume that the SDP Answer from Kurento is accepting all
      // of our medias, formats, and options.

      const kmsSdpAnswerObj = SdpTransform.parse(sdpAnswer);
      console.log(kmsSdpAnswerObj)
      const mediaObj = (kmsSdpAnswerObj.media || []).find(
        (m: any) => m.type === "video"
      );
      if (!mediaObj) {
        throw new Error("[startKurentoRtpConsumer] m=video section not found");
      }

      // Use the KMS IP address provided in the config. This is better than the SDP
      // connection IP, because that one will be an unreachable private IP if KMS
      // is behind a NAT (or inside a non-"host network" Docker container).
      // Also, when running KMS from Docker for Mac or Windows, the host doesn't
      // have direct access to container's private IP address because there is
      // actually a virtual machine in between, so more reason to avoid the SDP IP.
      const kmsIp = kurentoConfig.Settings.kurento.ip;
      kmsSdpAnswerObj.connection.ip = kmsIp;
      kmsSdpAnswerObj.origin.address = kmsIp;
      const sdpAnswerRewrite = SdpTransform.write(kmsSdpAnswerObj);
      console.log(sdpAnswerRewrite); 

      const kmsPortRtp = mediaObj.port;
      let kmsPortRtcp = kmsPortRtp + 1;
      if ("rtcp" in mediaObj) {
        // If "a=rtcp:<Port>" is found in the SDP Answer
        kmsPortRtcp = mediaObj.rtcp.port;
      }


      // Connect the mediasoup transport to enable sending (S)RTP/RTCP and receiving
      // (S)RTCP packets to/from Kurento

      let srtpParams = {
        cryptoSuite: CryptoSuite,
        keyBase64: kurentoConfig.Settings.srtp.keyBase64,
      };

      bindFFmpeg(kmsIp, kmsPortRtp, sdpAnswerRewrite, roomName);
  /*    await transport.connect({
        ip: kmsIp,
        port: kmsPortRtp,
        rtcpPort: kmsPortRtcp,
        srtpParameters: srtpParams,
      }).catch((err:any)=>{console.log(err)});
      console.log("TRANSPORT CONNECTED");*/
    });
  })
  socket.on('getProducers', callback => {
    //return all producer transports
    const { roomName } = peers[socket.id]

    let producerList: Array<any> = [];
    producers.forEach(producerData => {
      if (producerData.socketId !== socket.id && producerData.roomName === roomName) {
        producerList = [...producerList, producerData.producer.id]
      }
    })

    // return the producer list back to the client
    callback(producerList)
  })


  // see client's socket.emit('transport-connect', ...)
  socket.on('transport-connect', ({ dtlsParameters }) => {
    console.log('DTLS PARAMS... ', { dtlsParameters })

    getTransport(socket.id).connect({ dtlsParameters })
  })

  // see client's socket.emit('transport-produce', ...)
  socket.on('transport-produce', async ({ kind, rtpParameters, appData }, callback) => {
    // call produce based on the prameters from the client
    const producer = await getTransport(socket.id).produce({
      kind,
      rtpParameters,
    })

    // add producer to the producers array
    const { roomName } = peers[socket.id]

    addProducer(producer, roomName, socket.id)
    console.log("after producer");
    //client.publish('producer', producer.id);
    informConsumers(roomName, socket.id, producer.id)

    console.log('Producer ID: ', producer.id, producer.kind)

    producer.on('transportclose', () => {
      console.log('transport for this producer closed ')
      producer.close()
    })

    // Send back to the client the Producer's id
    callback({
      id: producer.id,
      producersExist: producers.length > 1 ? true : false
    })
  })
////////////////////// CONSUMER GATEWAY
  // see client's socket.emit('transport-recv-connect', ...)
  socket.on('transport-recv-connect', async ({ dtlsParameters, serverConsumerTransportId }) => {
    console.log(`DTLS PARAMS: ${dtlsParameters}`)
    const consumerTransport = transports.find((transportData: any) => (
      transportData.consumer && transportData.transport.id == serverConsumerTransportId
    )).transport
    await consumerTransport.connect({ dtlsParameters })
  })

  socket.on('consume', async ({ rtpCapabilities, remoteProducerId, serverConsumerTransportId, remoteSocketId }, callback) => {
    try {

      const { roomName } = peers[remoteSocketId]
      const router = rooms[roomName].router
      let consumerTransport = transports.find((transportData: any) => (
        transportData.consumer && transportData.transport.id == serverConsumerTransportId
      )).transport

      // check if the router can consume the specified producer
      if (router.canConsume({
        producerId: remoteProducerId,
        rtpCapabilities
      })) {
        // transport can now consume and return a consumer
        const consumer = await consumerTransport.consume({
          producerId: remoteProducerId,
          rtpCapabilities,
          paused: true,
        })
          console.log('transport close from consumer')

        consumer.on('producerclose', () => {
          console.log('producer of consumer closed')
          socket.emit('producer-closed', { remoteProducerId })

          consumerTransport.close([])
          transports = transports.filter((transportData: any) => transportData.transport.id !== consumerTransport.id)
          consumer.close()
          consumers = consumers.filter(consumerData => consumerData.consumer.id !== consumer.id)
        })

        addConsumer(consumer, roomName, remoteSocketId)

        // from the consumer extract the following params
        // to send back to the Client
        const params = {
          id: consumer.id,
          producerId: remoteProducerId,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
          serverConsumerId: consumer.id,
        }

        // send the parameters to the client
        callback({ params })
      }
    } catch (error) {
      console.log('catch', error)
      callback({
        params: {
          error: error
        }
      })
    }
  })
  socket.on('consumer-resume', async ({ serverConsumerId }) => {
    console.log('consumer resume')
    const { consumer } = consumers.find(consumerData => consumerData.consumer.id === serverConsumerId)
    await consumer.resume()
  })
})

