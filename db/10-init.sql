CREATE TABLE servers (
    server_id varchar(20) PRIMARY KEY,
    server_nickname varchar(20)
)

CREATE TABLE channels (
    channel_id varchar(20) PRIMARY KEY,
    server_id varchar(20) REFERENCES servers(server_id),
    channel_type varchar(30)
)

CREATE TABLE mention_images (
    image_id serial PRIMARY KEY,
    user_id varchar(20),
    server_id varchar(20) REFERENCES servers(server_id)
    image_url text,
)

CREATE TABLE rules (
    rule_id serial PRIMARY KEY,
    server_id varchar(20) REFERENCES servers(server_id)
    rule_index smallint,
    rule_content text,
)

CREATE TABLE roles (
    role_id varchar(20) PRIMARY KEY,
    server_id varchar(20) REFERENCES servers(server_id),
    role_type varchar(30)
)
