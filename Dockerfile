# Use Node.js 20 LTS as the base image
FROM node:20.10.0

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application code to the working directory
COPY . /app

# Install NestJS dependencies using Yarn
# Build the NestJS application
RUN yarn install --frozen-lockfile --include=dev \
    && yarn run build \
    && yarn run test \

