create table topic(
title varchar2(20),
bcontent varchar2(200),
bid varchar2(20)
);

SELECT * FROM topic;

INSERT INTO topic(title, bcontent, bid) VALUES ('title', 'bcontent', 'bid');

drop table topic;

UPDATE topic 
SET title = 'title_UPDATED', bcontent = 'bcontent_UPDATED', bid = 'bid_UPDATED'
WHERE title = 'title';
 
DELETE topic WHERE title = 'title_UPDATED';

commit;