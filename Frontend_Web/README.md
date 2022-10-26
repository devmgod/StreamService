# Streamlife

## Setup PHP dev environment

### Prerequisites

Install postgresql

Install php-pgsql driver

Install php-curl

Install python3-psycopg2

### Provision Database

#### Start postgres service
    sudo service postgres start

#### Set postgres password
    sudo su postgres
    psql
    \password postgres (set as postgres)

#### Create streamlife table

    CREATE DATABASE streamlife;

#### Create accounts table
    \c streamlife;
    CREATE TABLE IF NOT EXISTS public.accounts
    (
      user_id uuid PRIMARY KEY NOT NULL,
      username character varying(50) COLLATE pg_catalog."default" NOT NULL,
      password_token character varying(355) COLLATE pg_catalog."default" NOT NULL,
      email character varying(355) COLLATE pg_catalog."default" NOT NULL,
      birthdate date NOT NULL,
      country character varying(255) COLLATE pg_catalog."default",
      subdivision character varying(255) COLLATE pg_catalog."default",
      city character varying(255) COLLATE pg_catalog."default",
      postalcode character varying(255) COLLATE pg_catalog."default",
      latitude double precision,
      longitude double precision,
      metrocode integer,
      created_on timestamp without time zone DEFAULT now(),
      last_login timestamp without time zone,
      descriptions text COLLATE pg_catalog."default"  descriptions text COLLATE pg_catalog."default",
      networkaddress INET NOT NULL,
      token text COLLATE pg_catalog."default",
      expiry_time timestamp without time zone,
      stripe_customer_id character varying(355) COLLATE pg_catalog."default"
    );

#### Create images table
        CREATE TABLE IF NOT EXISTS public.images
        (
            user_id uuid NOT NULL,
            file_id character varying(355) COLLATE pg_catalog."default" NOT NULL,
            file_name character varying(355) COLLATE pg_catalog."default" NOT NULL,
            main integer DEFAULT 0,
            created_on timestamp without time zone DEFAULT now(),
            CONSTRAINT images_file_id_key UNIQUE (file_id)
        );

#### Create followers table
        CREATE TABLE IF NOT EXISTS public.followers
        (
            user_id uuid NOT NULL,
            follower_id uuid NOT NULL,
            created_on timestamp without time zone DEFAULT now(),
            id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 )
        );

#### Create transactions table
        CREATE TABLE IF NOT EXISTS public.transactions
        (
            user_id uuid NOT NULL,
            order_id character varying(355) COLLATE pg_catalog."default",
            transaction_id character varying(355) COLLATE pg_catalog."default" NOT NULL,
            amount character varying(355) COLLATE pg_catalog."default" NOT NULL,
            status character varying(355) COLLATE pg_catalog."default",
            payment_date timestamp without time zone DEFAULT now(),
            items character varying(355) COLLATE pg_catalog."default",
            payment_for character varying(60) COLLATE pg_catalog."default",
            payment_type character varying(60) COLLATE pg_catalog."default"
        );

#### Populate accounts and images tables
    cd backend/db
    python insertaccounts.py

### Landing Page

    cd landing-page
    php -S 0.0.0.0:8080

The landing page can now be accessed at 127.0.0.1:8080

### API

    cd api
    php -S 0.0.0.0:9090

The API can now be accessed at 127.0.0.1:9090
