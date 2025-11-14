# MegaVibeNetwork - WampServer Deployment Guide

This guide explains how to properly deploy the MegaVibeNetwork website to WampServer with PHP backend and React frontend.

## Prerequisites

- WampServer installed and running
- Node.js and npm installed (for building the React app)
- MySQL database created with credentials:
  - Database: `mvn2`
  - Username: `root`
  - Password: `757nfVdFK`
  - Collation: `utf8mb4_0900_ai_ci`

## Step 1: Build the React Frontend

The React app must be built into static files before deployment. Run this command in the project root:

```bash
npm install
npm run build
```

This creates optimized production files in `dist/public/` directory.

## Step 2: Prepare WampServer Directory

1. Create a new folder in WampServer's www directory:
   ```
   C:\wamp64\www\mvn2\
   ```

2. Copy the following to `C:\wamp64\www\mvn2\`:
   - All files from `dist/public/` (the built React app)
   - The `api/` directory (PHP backend)
   - The `config/` directory (database configuration)
   - The `models/` directory (database models)
   - The `.htaccess` file
   - The `WAMPSERVER_SETUP.md` file

3. Create the uploads directory:
   ```
   C:\wamp64\www\mvn2\uploads\
   C:\wamp64\www\mvn2\uploads\image\
   C:\wamp64\www\mvn2\uploads\audio\
   ```

## Step 3: Set Up the Database

1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Create a new database named `mvn2` with collation `utf8mb4_0900_ai_ci`
3. Import the database schema:
   - Export your existing database from the Node.js version
   - Or manually create the tables using the schema from `drizzle/schema.ts`

### Manual Table Creation

If you need to create tables manually, use these SQL commands:

```sql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `openId` varchar(64) NOT NULL UNIQUE,
  `name` text,
  `email` varchar(320),
  `loginMethod` varchar(64),
  `role` enum('user','admin') DEFAULT 'user' NOT NULL,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `releases` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `format` varchar(50) NOT NULL,
  `description` text,
  `imageUrl` text,
  `audioPreviewUrl` text,
  `releaseDate` datetime NOT NULL,
  `youtubeLink` text,
  `spotifyLink` text,
  `appleMusicLink` text,
  `storeLink` text,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tracks` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `releaseId` int NOT NULL,
  `trackNumber` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `length` varchar(10) NOT NULL,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`releaseId`) REFERENCES `releases`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `news` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `content` text NOT NULL,
  `imageUrl` text,
  `publishDate` datetime NOT NULL,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

## Step 4: Configure Apache (Optional - for Virtual Host)

To access the site at `http://mvn2.local` instead of `http://localhost/mvn2`:

1. Edit `C:\wamp64\bin\apache\apache2.4.x\conf\extra\httpd-vhosts.conf`:

```apache
<VirtualHost *:80>
    ServerName mvn2.local
    DocumentRoot "C:/wamp64/www/mvn2"
    <Directory "C:/wamp64/www/mvn2">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

2. Edit `C:\Windows\System32\drivers\etc\hosts`:

```
127.0.0.1 mvn2.local
```

3. Restart Apache in WampServer

## Step 5: Verify Installation

1. Start WampServer (all services should be green)
2. Access the website:
   - Without virtual host: http://localhost/mvn2
   - With virtual host: http://mvn2.local
3. Test the admin panel by clicking the person icon in the top-right navigation
4. Create a test release through the admin panel to verify API connectivity

## File Structure After Deployment

```
C:\wamp64\www\mvn2\
├── index.html              (Built React app entry point)
├── assets/                 (Built React assets)
├── api/                    (PHP API endpoints)
│   ├── releases/
│   ├── tracks/
│   ├── news/
│   └── upload/
├── config/                 (Database configuration)
│   ├── Database.php
│   └── ApiResponse.php
├── models/                 (Database models)
│   ├── User.php
│   ├── Release.php
│   ├── Track.php
│   └── News.php
├── uploads/                (User uploaded files)
│   ├── image/
│   └── audio/
├── .htaccess               (Apache configuration)
└── WAMPSERVER_SETUP.md     (Setup instructions)
```

## Troubleshooting

### 404 Errors on API Calls
- Ensure `.htaccess` is in the root directory
- Check that Apache `mod_rewrite` is enabled
- Verify the API endpoints in browser console match the PHP structure

### Database Connection Errors
- Verify MySQL is running in WampServer
- Check database credentials in `config/Database.php`
- Ensure the `mvn2` database exists with correct collation
- Test connection: Create a test release through admin panel

### File Upload Issues
- Ensure `uploads/` directory exists and is writable
- Check file permissions: Right-click folder → Properties → Security
- Verify file size limits in `php.ini` (default is usually sufficient)

### React App Not Loading
- Ensure `dist/public/index.html` exists (run `npm run build`)
- Check browser console (F12) for specific error messages
- Verify all built assets are in the correct location

### Module Loading Errors
- This error occurs when trying to load TypeScript files directly
- Always build the React app first with `npm run build`
- Never try to run the development version on WampServer

## Security Notes

1. **Change Database Password**: Update the password in `config/Database.php` from the default
2. **Use HTTPS in Production**: Configure SSL/TLS certificates for production
3. **Validate Inputs**: All user inputs are validated on the backend
4. **Protect Sensitive Files**: Ensure `.env` and configuration files are not accessible
5. **Keep Software Updated**: Regularly update WampServer, PHP, and MySQL

## Performance Tips

1. **Enable Gzip Compression**: Already configured in `.htaccess`
2. **Browser Caching**: Static assets have cache headers set
3. **Database Optimization**: Add indexes to frequently queried columns
4. **Image Optimization**: Compress images before uploading
5. **CDN for Large Files**: Consider using a CDN for audio files

## API Endpoints

All endpoints are available at `/api/`:

### Releases
- `GET /api/releases` - Get all releases
- `GET /api/releases?action=latest&limit=5` - Get latest releases
- `POST /api/releases` - Create release
- `PUT /api/releases` - Update release
- `DELETE /api/releases` - Delete release

### Tracks
- `GET /api/tracks` - Get all tracks
- `GET /api/tracks?action=getByReleaseId&releaseId=1` - Get tracks by release
- `POST /api/tracks` - Create track
- `DELETE /api/tracks` - Delete track

### News
- `GET /api/news` - Get all news articles
- `GET /api/news?action=latest&limit=5` - Get latest articles
- `POST /api/news` - Create news article
- `DELETE /api/news` - Delete news article

### File Upload
- `POST /api/upload` - Upload file (image or audio)

## Support

For issues or questions:
- Check WampServer documentation: http://www.wampserver.com/
- Review PHP documentation: https://www.php.net/docs.php
- Check Apache documentation: https://httpd.apache.org/docs/
