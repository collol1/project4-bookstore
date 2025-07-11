-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS bookstore;
USE bookstore;

-- Bảng Users
CREATE TABLE IF NOT EXISTS Users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Categories (với hình ảnh)
CREATE TABLE IF NOT EXISTS Categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255) COMMENT 'Đường dẫn ảnh danh mục'
);

-- Bảng Authors (Tác giả)
CREATE TABLE IF NOT EXISTS Authors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    biography TEXT,
    birth_date DATE,
    image_url VARCHAR(255) COMMENT 'Đường dẫn ảnh tác giả',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Books (với hình ảnh)
CREATE TABLE IF NOT EXISTS Books (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id VARCHAR(36),
    stock INT NOT NULL DEFAULT 0,
    image_url VARCHAR(255) COMMENT 'Đường dẫn ảnh bìa sách',
    published_date DATE,
    isbn VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL,
    FOREIGN KEY (author_id) REFERENCES Authors(id) ON DELETE CASCADE
);

-- Bảng Orders (đã bổ sung thông tin thanh toán)
CREATE TABLE IF NOT EXISTS Orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    payment_method ENUM('credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery') NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    payment_date TIMESTAMP NULL,
    transaction_id VARCHAR(100) COMMENT 'ID giao dịch từ cổng thanh toán',
    shipping_address TEXT NOT NULL,
    billing_address TEXT,
    contact_phone VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Bảng OrderItems
CREATE TABLE IF NOT EXISTS OrderItems (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    book_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES Books(id) ON DELETE CASCADE
);

-- Bảng BookImages (quản lý nhiều ảnh cho sách)
CREATE TABLE IF NOT EXISTS BookImages (
    id VARCHAR(36) PRIMARY KEY,
    book_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES Books(id) ON DELETE CASCADE
);
-- Thêm dữ liệu vào bảng Users
INSERT INTO Users (id, username, email, password, role) VALUES
('u1', 'admin', 'admin@bookstore.com', '$2b$10$Xc2vkvvDY4gPtV4.IblgYe/wbi2NXtu5Ep3NeulVWOM99cMQePzoy', 'admin'),
('u2', 'john_doe', 'john@example.com', '$2b$10$Xc2vkvvDY4gPtV4.IblgYe/wbi2NXtu5Ep3NeulVWOM99cMQePzoy', 'user'),
('u3', 'jane_smith', 'jane@example.com', '$2b$10$Xc2vkvvDY4gPtV4.IblgYe/wbi2NXtu5Ep3NeulVWOM99cMQePzoy', 'user'),
('u4', 'mike_jones', 'mike@example.com', '$2b$10$Xc2vkvvDY4gPtV4.IblgYe/wbi2NXtu5Ep3NeulVWOM99cMQePzoy', 'user');

-- Thêm dữ liệu vào bảng Categories
INSERT INTO Categories (id, name, description, image_url) VALUES
('c1', 'Tiểu thuyết', 'Các tác phẩm văn học dài, hư cấu', '/assets/novel.jpg'),
('c2', 'Khoa học viễn tưởng', 'Sách về tương lai, công nghệ và vũ trụ', '/assets/scifi.jpg'),
('c3', 'Kinh doanh', 'Sách về quản lý, tài chính và khởi nghiệp', '/assets/business.jpg'),
('c4', 'Lịch sử', 'Sách về các sự kiện lịch sử', '/assets/history.jpg'),
('c5', 'Tâm lý học', 'Sách về hành vi và tâm trí con người', '/assets/psychology.jpg');

-- Thêm dữ liệu vào bảng Authors
INSERT INTO Authors (id, name, biography, birth_date, image_url) VALUES
('a1', 'Nguyễn Nhật Ánh', 'Nhà văn nổi tiếng với các tác phẩm tuổi thơ', '1955-05-07', '/assets/nguyen-nhat-anh.jpg'),
('a2', 'George Orwell', 'Tiểu thuyết gia người Anh nổi tiếng với 1984 và Animal Farm', '1903-06-25', '/assets/orwell.jpg'),
('a3', 'Dale Carnegie', 'Tác giả nổi tiếng về sách tự lực', '1888-11-24', '/assets/carnegie.jpg'),
('a4', 'Yuval Noah Harari', 'Nhà sử học và tác giả người Israel', '1976-02-24', '/assets/harari.jpg'),
('a5', 'Nguyễn Ngọc Tư', 'Nhà văn nữ nổi tiếng Việt Nam', '1976-03-06', '/assets/nguyen-ngoc-tu.jpg');

-- Thêm dữ liệu vào bảng Books
INSERT INTO Books (id, title, author_id, description, price, category_id, stock, image_url, published_date, isbn) VALUES
('b1', 'Cho tôi xin một vé đi tuổi thơ', 'a1', 'Câu chuyện về tuổi thơ đầy cảm xúc', 75000, 'c1', 100, '/assets/cho-toi-xin-mot-ve.jpg', '2008-12-09', '9786046988894'),
('b2', 'Mắt biếc', 'a1', 'Tình yêu tuổi học trò đầy cảm động', 68000, 'c1', 85, '/assets/mat-biec.jpg', '1990-01-01', '9786046988895'),
('b3', '1984', 'a2', 'Tiểu thuyết dystopian nổi tiếng', 120000, 'c2', 50, '/assets/1984.jpg', '1949-06-08', '9780451524935'),
('b4', 'Đắc Nhân Tâm', 'a3', 'Sách về nghệ thuật giao tiếp và đối nhân xử thế', 95000, 'c3', 120, '/assets/dac-nhan-tam.jpg', '1936-10-01', '9780671027032'),
('b5', 'Sapiens: Lược sử loài người', 'a4', 'Lịch sử phát triển của loài người', 150000, 'c4', 75, '/assets/sapiens.jpg', '2011-02-10', '9780062316097'),
('b6', 'Cánh đồng bất tận', 'a5', 'Tập truyện ngắn đặc sắc', 85000, 'c1', 60, '/assets/canh-dong-bat-tan.jpg', '2005-01-01', '9786046988896'),
('b7', 'Animal Farm', 'a2', 'Châm biếm về chính trị xã hội', 110000, 'c1', 40, '/assets/animal-farm.jpg', '1945-08-17', '9780451526342'),
('b8', 'Homo Deus: Lược sử tương lai', 'a4', 'Viễn cảnh về tương lai loài người', 160000, 'c4', 55, '/assets/homo-deus.jpg', '2015-09-01', '9781910701871');

-- Thêm dữ liệu vào bảng BookImages
INSERT INTO BookImages (id, book_id, image_url, is_primary) VALUES
('bi1', 'b1', '/assets/cho-toi-xin-mot-ve-1.jpg', TRUE),
('bi2', 'b1', '/assets/cho-toi-xin-mot-ve-2.jpg', FALSE),
('bi3', 'b2', '/assets/mat-biec-1.jpg', TRUE),
('bi4', 'b3', '/assets/1984-1.jpg', TRUE),
('bi5', 'b3', '/assets/1984-2.jpg', FALSE),
('bi6', 'b4', '/assets/dac-nhan-tam-1.jpg', TRUE),
('bi7', 'b5', '/assets/sapiens-1.jpg', TRUE),
('bi8', 'b6', '/assets/canh-dong-bat-tan-1.jpg', TRUE),
('bi9', 'b7', '/assets/animal-farm-1.jpg', TRUE),
('bi10', 'b8', '/assets/homo-deus-1.jpg', TRUE);

-- Thêm dữ liệu vào bảng Orders
INSERT INTO Orders (id, user_id, total_price, status, payment_method, payment_status, payment_date, transaction_id, shipping_address, billing_address, contact_phone, notes) VALUES
('o1', 'u2', 243000, 'delivered', 'credit_card', 'paid', '2023-05-10 14:30:00', 'txn_123456789', '123 Đường ABC, Quận 1, TP.HCM', '123 Đường ABC, Quận 1, TP.HCM', '0901234567', 'Giao hàng giờ hành chính'),
('o2', 'u3', 235000, 'shipped', 'paypal', 'paid', '2023-05-15 09:15:00', 'txn_987654321', '456 Đường XYZ, Quận 3, TP.HCM', '789 Đường DEF, Quận 2, TP.HCM', '0912345678', NULL),
('o3', 'u2', 160000, 'processing', 'bank_transfer', 'pending', NULL, NULL, '123 Đường ABC, Quận 1, TP.HCM', '123 Đường ABC, Quận 1, TP.HCM', '0901234567', 'Kiểm tra sách kỹ trước khi giao'),
('o4', 'u4', 85000, 'pending', 'cash_on_delivery', 'pending', NULL, NULL, '789 Đường DEF, Quận 2, TP.HCM', '789 Đường DEF, Quận 2, TP.HCM', '0987654321', NULL);

-- Thêm dữ liệu vào bảng OrderItems
INSERT INTO OrderItems (id, order_id, book_id, quantity, price_at_purchase) VALUES
('oi1', 'o1', 'b1', 1, 75000),
('oi2', 'o1', 'b4', 1, 95000),
('oi3', 'o1', 'b6', 1, 85000),
('oi4', 'o2', 'b3', 1, 120000),
('oi5', 'o2', 'b5', 1, 150000),
('oi6', 'o3', 'b8', 1, 160000),
('oi7', 'o4', 'b6', 1, 85000);

SELECT * FROM Users WHERE username = 'admin';
select*from users
