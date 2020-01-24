--
-- Table structure for table `ambition design customer portal`
--
DROP TABLE IF EXISTS `role_type`;
CREATE TABLE `role_type` (
    `id`            BIGINT(20) NOT NULL AUTO_INCREMENT,
    `name`      	VARCHAR(25),
    PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `id`                        BIGINT(20) NOT NULL AUTO_INCREMENT,
    `email`   	                VARCHAR(255) NOT NULL,
    `password` 	                VARCHAR(255) NOT NULL,
    `first_name`   	            VARCHAR(255) NOT NULL,
    `last_name`   	            VARCHAR(255) NOT NULL,
    `reset_password_token`   	VARCHAR(255),
    `reset_password_expires`    DATETIME,
    `updated`   	            DATETIME,
    `created`   	            DATETIME,
    PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
    `user_id`               BIGINT(20) NOT NULL,
    `role_type_id`      	BIGINT(20) NOT NULL,
    CONSTRAINT `role_role_type_fk` FOREIGN KEY (`role_type_id`) REFERENCES `role_type` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT `role_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
);
