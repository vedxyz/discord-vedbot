CREATE TABLE servers (
    server_id text PRIMARY KEY,
    server_nickname text UNIQUE -- cs, dh, cr, ...
);

CREATE TABLE channels (
    channel_id text PRIMARY KEY,
    server_id text REFERENCES servers(server_id),
    channel_type text -- log, admin, etc.
);

CREATE TABLE mention_images (
    image_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id text,
    server_id text REFERENCES servers(server_id),
    image_url text
);

CREATE TABLE rules (
    rule_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    server_id text REFERENCES servers(server_id),
    rule_index smallint, -- Example, rule #1 or #12, etc.
    rule_content text
);

CREATE TABLE roles (
    role_id text PRIMARY KEY,
    server_id text REFERENCES servers(server_id),
    role_type text -- admin, etc.
);

CREATE TABLE meal_subscriptions (
    subscription_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id text,
    subscription_type smallint,
    hour smallint,
    weekend boolean
);
