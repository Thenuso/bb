#!/bin/bash

# Bulldog Stream Platform - Development Setup Script
# This script helps you get started quickly with development

set -e

echo "🎬 Bulldog Stream Platform - Development Setup"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
check_nodejs() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js found: $NODE_VERSION"
        
        # Check if version is 16 or higher
        MAJOR_VERSION=$(echo $NODE_VERSION | sed 's/v//' | cut -d'.' -f1)
        if [ "$MAJOR_VERSION" -ge 16 ]; then
            print_status "Node.js version is compatible"
        else
            print_error "Node.js version 16+ required. Current: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js not found. Please install Node.js 16+ from https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_status "npm found: $NPM_VERSION"
    else
        print_error "npm not found. Please install npm"
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing project dependencies..."
    
    if npm install; then
        print_status "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Setup environment file
setup_environment() {
    if [ ! -f ".env" ]; then
        print_info "Creating environment file from template..."
        cp .env.example .env
        print_warning "Please edit .env file with your actual configuration values"
        print_info "Minimum required: SUPABASE_URL, SUPABASE_SERVICE_KEY, JWT_SECRET"
    else
        print_status "Environment file already exists"
    fi
}

# Check environment configuration
check_environment() {
    if [ -f ".env" ]; then
        print_info "Checking environment configuration..."
        
        # Source the .env file to check variables
        set -a
        source .env
        set +a
        
        # Check essential variables
        if [ -z "$SUPABASE_URL" ] || [ "$SUPABASE_URL" = "https://your-project.supabase.co" ]; then
            print_warning "SUPABASE_URL not configured in .env"
        else
            print_status "Database URL configured"
        fi
        
        if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-super-secret-jwt-key-change-this-in-production" ]; then
            print_warning "JWT_SECRET not configured in .env"
        else
            print_status "JWT Secret configured"
        fi
        
        if [ -z "$STRIPE_SECRET_KEY" ] || [ "$STRIPE_SECRET_KEY" = "sk_test_your_stripe_key" ]; then
            print_warning "Stripe not configured (optional for development)"
        else
            print_status "Stripe configured"
        fi
    else
        print_error ".env file not found"
        exit 1
    fi
}

# Create necessary directories
create_directories() {
    print_info "Creating necessary directories..."
    mkdir -p logs
    mkdir -p uploads/videos
    mkdir -p uploads/images
    mkdir -p dist
    print_status "Directories created"
}

# Database setup instructions
database_setup() {
    print_info "Database Setup Instructions:"
    echo ""
    echo "1. Go to https://supabase.com and create a free account"
    echo "2. Create a new project"
    echo "3. Go to Settings > API to get your project URL and keys"
    echo "4. Go to SQL Editor and run the contents of database-schema.sql"
    echo "5. Update your .env file with the credentials"
    echo ""
}

# Display next steps
show_next_steps() {
    print_info "Setup complete! Next steps:"
    echo ""
    echo "1. Configure your database (see instructions above)"
    echo "2. Edit .env file with your actual values"
    echo "3. Run: npm run dev"
    echo "4. Open: http://localhost:3000"
    echo ""
    print_status "Happy coding! 🎬"
}

# Main setup process
main() {
    echo ""
    print_info "Starting development environment setup..."
    echo ""
    
    # Run checks and setup
    check_nodejs
    check_npm
    install_dependencies
    setup_environment
    check_environment
    create_directories
    
    echo ""
    print_status "Development environment setup complete!"
    echo ""
    
    database_setup
    show_next_steps
}

# Run main function
main

# Make the script exit cleanly
exit 0
