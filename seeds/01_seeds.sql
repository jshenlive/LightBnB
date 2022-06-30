INSERT INTO users (name, email, password)
VALUES ('Joe Cannon','abc@abc.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), 
('Candy Shaw','123@123.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Fancy Sunny', '1111@2222.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description,thumbnail_photo_url,cover_photo_url, cost_per_night, parking_spaces,number_of_bathrooms, number_of_bedrooms, country,street,city,province,post_code,active)
VALUES 
(1, 'Jacks Hill', 'description','www.photo1.url','www.coverphoto1.url',1500,6,4,6,'CANADA','321 Jacks mountain','Wind High','BC','V3Z 6E1',TRUE),
(2, 'Lake Sun', 'description','www.photo2.url','www.coverphoto2.url',550,2,2,3,'CANADA','456 Lake view drive','Low valeey','AB','A5C 1R2',TRUE),
(3, 'Ocean Cliff', 'description','www.photo3.url','www.coverphoto3.url',3000,4,3,4,'CANADA','111 Beach ave','Retireman','BC','V5V 5V5',TRUE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES
('2018-09-11','2018-09-26',2,3),
('2019-01-03','2019-01-08',1,1),
('2017-03-10','2018-03-21',1,2),
('2020-10-01','2018-10-06',1,3),
('2021-05-11','2018-05-15',2,1),
('2022-06-30','2022-07-10',3,1);

INSERT INTO property_reviews (guest_id,property_id,reservation_id,rating, message)
VALUES
(3,2,1,4,'message'),
(1,1,2,5,'message'),
(2,1,3,3,'message'),
(3,1,4,5,'message'),
(1,2,5,4,'message'),
(1,3,6,5,'message');