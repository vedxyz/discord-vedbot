CREATE TABLE servers (
    server_id varchar(20) PRIMARY KEY,
    server_nickname varchar(20)
)

CREATE TABLE channels (
    channel_id varchar(20) PRIMARY KEY,
    server_id varchar(20) REFERENCES servers(server_id),
    type varchar(30)
)

CREATE TABLE mention_pics (
    user_id varchar(20) PRIMARY KEY,
    server_id varchar(20) REFERENCES servers(server_id)
    url text,
)

CREATE TABLE rules (
    rule_id serial PRIMARY KEY,
    server_id varchar(20) REFERENCES servers(server_id)
    rule_count smallint,
    rule_content text,
)

CREATE TABLE roles (
    role_id varchar(20) PRIMARY KEY,
    server_id varchar(20) REFERENCES servers(server_id),
    type varchar(30)
)
