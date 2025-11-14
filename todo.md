# MegaVibeNetwork TODO - PHP Backend Conversion

## Phase 1: PHP Backend Setup
- [x] Create PHP directory structure (api/, config/, models/)
- [x] Create database connection class with PDO
- [x] Create config file with WampServer database credentials
- [x] Set up CORS headers for React frontend communication
- [x] Create base API response handler class

## Phase 2: PHP API Endpoints
- [x] Create releases API endpoints (getAll, getLatest, getById, create, update, delete)
- [x] Create tracks API endpoints (getAll, create, update, delete)
- [x] Create news API endpoints (getAll, getLatest, getById, create, update, delete)
- [x] Create API router and CORS handling
- [ ] Create auth API endpoints (login, logout, me)

## Phase 3: File Upload Handlers
- [x] Create file upload endpoint for release images
- [x] Create file upload endpoint for release audio
- [x] Create file upload endpoint for news images
- [x] Implement file validation and storage

## Phase 4: React Frontend Updates
- [x] Update Home page to use PHP API
- [x] Update Releases page to use PHP API
- [x] Update News page to use PHP API
- [x] Update Admin panel to use PHP API
- [x] Update FileUpload component for PHP backend
- [ ] Build React app for production

## Phase 5: WampServer Deployment
- [x] Create .htaccess for Apache URL rewriting
- [x] Create index.html entry point
- [ ] Configure Apache virtual host for mvn2
- [ ] Set up database in WampServer MySQL
- [ ] Deploy files to WampServer www directory
- [ ] Test all functionality locally

## Phase 6: Documentation
- [x] Create setup instructions for WampServer
- [x] Document PHP API endpoints
- [x] Create deployment guide
