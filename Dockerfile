FROM ubuntu:22.04

# ------------------------------
# Install system dependencies
# ------------------------------
RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    g++ \
    python3 \
    openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

# ------------------------------
# Install Node.js (18.x)
# ------------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# ------------------------------
# App directory
# ------------------------------
WORKDIR /app

# ------------------------------
# Copy backend dependencies
# ------------------------------
COPY server/package*.json ./
RUN npm install

# ------------------------------
# Copy backend source code
# ------------------------------
COPY server .

# ------------------------------
# Create temp directory for code execution
# ------------------------------
RUN mkdir -p temp && chmod 777 temp

# ------------------------------
# Expose port (Render will override)
# ------------------------------
EXPOSE 3000

# ------------------------------
# Start backend server
# ------------------------------
CMD ["npm", "start"]
