@echo off

:: php artisan storage:link -> cria um link virtual para uploads na pasta public
start "Backend" cmd /c "cd backend && php artisan storage:link && php artisan config:clear && php artisan config:cache && php artisan cache:clear && php artisan route:cache && php artisan serve"
start "Frontend" cmd /c "cd frontend && npm cache clean --force && npm run dev"