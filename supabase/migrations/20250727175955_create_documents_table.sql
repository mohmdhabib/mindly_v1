create table documents (
  id bigserial primary key,
  content text,
  embedding vector(768)
);
