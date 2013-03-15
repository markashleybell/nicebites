delete from web_establishment;
delete from web_region;
alter sequence web_region_id_seq restart with 1;
alter sequence web_establishment_id_seq restart with 1;