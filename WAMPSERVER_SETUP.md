# MegaVibeNetwork - WampServer Setup Guide

This guide explains how to set up and run the MegaVibeNetwork music label website on WampServer.

## Prerequisites

- WampServer installed on your local machine
- MySQL database created with the following credentials:
  - Database name: `mvn2`
  - Username: `root`
  - Password: `757nfVdFK`
  - Collation: `utf8mb4_0900_ai_ci`

## Installation Steps

### 1. Create Database

1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database named `mvn2` with collation `utf8mb4_0900_ai_ci`
3. Import the database schema from `drizzle/migrations/` directory

### 2. Deploy Files to WampServer

1. Copy the entire project to WampServer's `www` directory:
   ```
   C:\wamp64\www\mvn2\
   ```

2. Ensure the following directories exist and are writable:
   ```
   uploads/
   uploads/image/
   uploads/audio/
   ```

### 3. Configure Apache Virtual Host (Optional)

If you want to access the site at `http://mvn2.local` instead of `http://localhost/mvn2`:

1. Edit `C:\wamp64\bin\apache\apache2.4.x\conf\extra\httpd-vhosts.conf`
2. Add the following:
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

3. Edit `C:\Windows\System32\drivers\etc\hosts` and add:
   ```
   127.0.0.1 mvn2.local
   ```

4. Restart Apache

### 4. Build React Frontend

The React frontend needs to be built before deployment:

```bash
cd /path/to/mvn2
npm install
npm run build
```

This creates a `dist/` directory with the compiled frontend.

### 5. Access the Website

- **With virtual host:** http://mvn2.local
- **Without virtual host:** http://localhost/mvn2

## API Endpoints

All API endpoints are accessible at `/api/`:

### Releases
- `GET /api/releases` - Get all releases
- `GET /api/releases?action=latest&limit=5` - Get latest releases
- `GET /api/releases?action=getById&id=1` - Get release by ID
- `POST /api/releases` - Create release
- `PUT /api/releases` - Update release
- `DELETE /api/releases` - Delete release

### Tracks
- `GET /api/tracks` - Get all tracks
- `GET /api/tracks?action=getByReleaseId&releaseId=1` - Get tracks by release
- `POST /api/tracks` - Create track
- `PUT /api/tracks` - Update track
- `DELETE /api/tracks` - Delete track

### News
- `GET /api/news` - Get all news articles
- `GET /api/news?action=latest&limit=5` - Get latest articles
- `POST /api/news` - Create news article
- `PUT /api/news` - Update news article
- `DELETE /api/news` - Delete news article

### File Upload
- `POST /api/upload` - Upload file (image or audio)

## Database Schema

The following tables are created automatically:

- `users` - User accounts and authentication
- `releases` - Music releases/albums
- `tracks` - Individual tracks within releases
- `news` - News articles

## Troubleshooting

### 404 Errors on API Calls
- Ensure `.htaccess` is present in the project root
- Check that Apache `mod_rewrite` is enabled
- Verify the API endpoints in the React frontend match the PHP API structure

### Database Connection Errors
- Verify MySQL is running in WampServer
- Check database credentials in `config/Database.php`
- Ensure the `mvn2` database exists

### File Upload Issues
- Ensure `uploads/` directory exists and is writable
- Check file permissions: `chmod 755 uploads/`
- Verify file size limits in `php.ini`

### React Router Not Working
- Ensure `.htaccess` is configured correctly
- Check that `mod_rewrite` is enabled in Apache
- Verify the `index.html` is in the project root

## File Structure

```
mvn2/
├── api/                 # PHP API endpoints
│   ├── releases/        # Release endpoints
│   ├── tracks/          # Track endpoints
│   ├── news/            # News endpoints
│   └── upload/          # File upload endpoint
├── config/              # Configuration files
│   ├── Database.php     # Database connection
│   └── ApiResponse.php  # API response handler
├── models/              # Database models
│   ├── User.php
│   ├── Release.php
│   ├── Track.php
│   └── News.php
├── client/              # React frontend source
├── dist/                # Built React frontend (after build)
├── uploads/             # Uploaded files
├── index.html           # Entry point
├── .htaccess            # Apache configuration
└── WAMPSERVER_SETUP.md  # This file
```

## Performance Tips

1. **Enable Gzip Compression:** The `.htaccess` file includes gzip configuration
2. **Browser Caching:** Static assets have cache headers set
3. **Database Optimization:** Add indexes to frequently queried columns
4. **CDN for Images:** Consider using a CDN for large image files

## Security Notes

- Change the default database password in `config/Database.php`
- Use HTTPS in production
- Validate and sanitize all user inputs
- Implement proper authentication/authorization
- Keep WampServer and PHP updated

## Support

For issues or questions, refer to:
- WampServer documentation: http://www.wampserver.com/
- PHP documentation: https://www.php.net/docs.php
- React documentation: https://react.dev/
