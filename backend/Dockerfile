# Stage 1: Build the Maven application with Java 21
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Copy Maven wrapper / POM
COPY pom.xml ./
RUN apk add --no-cache maven && mvn dependency:go-offline -B

# Copy application source code
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Distroless / Alpine JRE Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Run as non-privileged service user
RUN addgroup -S serviceops && adduser -S serviceops -G serviceops
USER serviceops:serviceops

COPY --from=builder /build/target/serviceops-backend-1.0.0.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
