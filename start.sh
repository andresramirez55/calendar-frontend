#!/bin/bash

# Exit on any error
set -e

echo "Starting Calendar Frontend..."

# Build the application
echo "Building application..."
npm run build

# Start the preview server
echo "Starting preview server on port ${PORT:-5173}..."
npm run preview -- --host 0.0.0.0 --port ${PORT:-5173} --strictPort
