-- --------------------------------------------------------
-- 호스트:                          192.168.0.71
-- 서버 버전:                        11.4.2-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 테이블 데이터 webpages.cart:~0 rows (대략적) 내보내기
INSERT INTO `cart` (`user_id`, `product_id`, `quantity`, `price`, `image_path`) VALUES
	('black', 4016, 1, 12000.00, NULL);

-- 테이블 데이터 webpages.member:~7 rows (대략적) 내보내기
INSERT INTO `member` (`user_id`, `password`, `name`, `nickname`, `birthdate`, `phone_number`, `email`, `address`) VALUES
	('black', 'pink', '김분홍', '블랙핑크', '2024-08-07', '010-1234-1234', 'blackpink@gmail.com', '대한민국'),
	('dogcatdog', 'dogcatdog', '강아자', '강집사들', '1997-06-30', '010-7418-9632', 'dogcatdog@gmail.com', '대구시 강쥐구 멍멍로99 귀여운주택 99'),
	('guriguri', 'guriguri', '구연산', '밐맛', '2001-11-01', '010-5585-7778', 'guriguri@naver.com', '서울시 강남구 미키로77 마우스아파트 207동 205호'),
	('justbuying', 'justbuying', '구경한', '토끼토끼당근당근', '2000-03-01', '010-8989-2323', 'justbuying@hanmail.net', '인천시 서구 바다로 놀러가리64'),
	('kindguitar', 'kindguitar', '이검정', '친절한 기타리스트', '1993-12-27', '010-9876-5432', 'kindguitar@naver.com', '부산시 동래구 검정로 기타리스트1004'),
	('knittingplant', 'knittingplant', '김식물', '이파리', '1985-07-26', '010-1234-5678', 'knittingplant@gmail.com', '울산시 남구 문수로 알록달록아파트 605동 2345호'),
	('nomoretask', 'nomoretask', '박대기', '종강언제', '2002-04-18', '010-2756-8687', 'nomoretask@gmail.com', '서울시 마포구 와우산로 홍익대학교 제2기숙사 1406호');

-- 테이블 데이터 webpages.order:~6 rows (대략적) 내보내기
INSERT INTO `order` (`order_id`, `product_id`, `order_quantity`, `delivery_address`, `order_date`) VALUES
	(1001240726, 4012, 5, '서울시 마포구 와우산로 홍익대학교 제2기숙사 1406호', '2024-07-26'),
	(1002240726, 4012, 1, '인천시 서구 바다로 놀러가리64', '2024-07-26'),
	(2001240725, 4012, 1, '대전시 무슨구 어떤로 어딘가아파트 106동 404호', '2024-07-25'),
	(2001240726, 4012, 15, '대구시 강쥐구 멍멍로99 귀여운주택 99', '2024-07-26'),
	(3001240726, 4012, 2, '인천시 서구 바다로 놀러가리64', '2024-07-26'),
	(4001240726, 4012, 1, '부산시 동래구 검정로 기타리스트1004', '2024-07-26');

-- 테이블 데이터 webpages.product:~11 rows (대략적) 내보내기
INSERT INTO `product` (`product_id`, `product_name`, `stock`, `price`, `category`, `product_type`, `image_path`) VALUES
	(4012, '선인장 니트 키링', 30, 6000.00, '패션잡화', '악세서리', '\\public\\images\\1724134389926.webp'),
	(4013, '해바라기 니트 동전지갑', 10, 25000.00, '패션잡화', '악세서리', '\\public\\images\\1724134460839.webp'),
	(4015, '장미 니트 동전지갑', 10, 25000.00, '패션잡화', '악세서리', '\\public\\images\\1724134495185.webp'),
	(4016, '락앤롤 프린트 반팔 티셔츠', 100, 12000.00, '패션잡화', '의류', '\\public\\images\\1724134565825.webp'),
	(4017, '폴짝폴짝 강쥐맨 스티커', 200, 3000.00, '문구류', '스티커', '\\public\\images\\1724134672944.webp'),
	(4018, '피크닉하는 멈머 포스터', 50, 8000.00, '인테리어', '포스터', '\\public\\images\\1724134711550.webp'),
	(4019, '안녕서울 자수 캡 모자', 50, 20000.00, '패션잡화', '모자', '\\public\\images\\1724134751031.webp'),
	(4020, '막창골목 네온사인 포스터', 25, 17000.00, '인테리어', '포스터', '\\public\\images\\1724134784848.webp'),
	(4021, '라인 모티브 폰케이스', 60, 7500.00, '디지털 악세서리', '폰케이스', '\\public\\images\\1724134869161.webp'),
	(4022, '라인 도형 폰케이스', 80, 8500.00, '디지털 악세서리', '폰케이스', '\\public\\images\\1724134907922.webp'),
	(4023, '숲 속의 여우 머그컵', 30, 5000.00, '생활용품', '컵', '\\public\\images\\1724134965321.webp');

-- 테이블 데이터 webpages.store:~4 rows (대략적) 내보내기
INSERT INTO `store` (`store_id`, `store_name`, `seller_address`, `seller_name`, `seller_email`) VALUES
	(1, '니팅플랜트', '울산시 남구 문수로 알록달록아파트 605동 2345호', '이파리', 'knittingplant@gmail.com'),
	(2, '블랙이즈더뉴기타', '부산시 동래구 검정로 기타리스트1004', '친절한 기타리스트', 'kindguitar@naver.com'),
	(3, '댕냥이들', '대구시 강쥐구 멍멍로99 귀여운주택 99', '강집사들', 'dogcatdog@gmail.com'),
	(4, '펑구리', '서울시 서대문구 아침로 마당빌딩304', '밐맛', 'guriguri@naver.com');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
