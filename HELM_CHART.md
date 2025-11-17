# Venue Booking Helm Chart

[![Helm Chart Version](https://img.shields.io/badge/helm%20chart-0.1.0-blue)](https://github.com/nidgetgod/venue-booking/pkgs/container/venue-booking)
[![CNPG Version](https://img.shields.io/badge/CNPG-0.26.1-green)](https://cloudnative-pg.io/)

Production-ready Helm chart for venue-booking application with CloudNativePG support.

## 🚀 Quick Start

### Prerequisites

- Kubernetes 1.24+
- Helm 3.8+
- CloudNativePG operator installed

### Install CNPG Operator

```bash
kubectl apply -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-0.26/releases/cnpg-0.26.1.yaml
```

### Install Chart from OCI Registry

```bash
# Install the chart
helm install venue-booking \
  oci://ghcr.io/nidgetgod/venue-booking \
  --version 0.1.0 \
  --namespace venue-booking \
  --create-namespace

# Or with custom values
helm install venue-booking \
  oci://ghcr.io/nidgetgod/venue-booking \
  --version 0.1.0 \
  -f custom-values.yaml \
  --namespace venue-booking \
  --create-namespace
```

### View Available Versions

```bash
# List all versions
helm search repo venue-booking --versions

# Show chart values
helm show values oci://ghcr.io/nidgetgod/venue-booking --version 0.1.0
```

## 📦 Features

### Database Management
- **Internal PostgreSQL**: CloudNativePG operator with 3-replica high availability
- **External Database**: Support for AWS RDS, Supabase, or any external PostgreSQL
- **Automatic DATABASE_URL**: Template helpers generate connection strings automatically
- **Configuration Validation**: Prevents invalid database configurations

### High Availability
- 3 PostgreSQL replicas with automatic failover
- Application HPA (2-5 replicas based on CPU/memory)
- Pod anti-affinity for HA distribution
- Automated daily backups with 30-day retention

### Security
- Pod Security Standards compliant
- SecurityContext with non-root user (UID 1000)
- RBAC with ServiceAccount
- TLS/SSL support via cert-manager
- Secrets management for database credentials

### Monitoring
- PodMonitor integration for Prometheus
- Liveness and readiness probes
- Resource requests and limits configured

### Infrastructure
- Nginx Ingress with TLS support
- ConfigMap for application configuration
- Service (ClusterIP) for internal communication
- HPA for automatic scaling based on metrics

## 📚 Configuration Examples

### Development Environment

```yaml
# dev-values.yaml
replicaCount: 1

postgresql:
  enabled: true
  instances: 1
  storage:
    size: 5Gi
  backup:
    enabled: false

resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi

autoscaling:
  enabled: false
```

```bash
helm install venue-booking oci://ghcr.io/nidgetgod/venue-booking \
  -f dev-values.yaml \
  --namespace venue-booking-dev \
  --create-namespace
```

### Production with Internal PostgreSQL

```yaml
# prod-values.yaml
replicaCount: 3

image:
  pullPolicy: IfNotPresent

postgresql:
  enabled: true
  instances: 3
  storage:
    size: 50Gi
    storageClass: fast-ssd
  backup:
    enabled: true
    schedule: "0 2 * * *"
    retentionPolicy: 30d
    s3:
      bucket: my-backups
      path: /venue-booking/
      region: us-west-2

resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 2000m
    memory: 2Gi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 5
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: booking.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: venue-booking-tls
      hosts:
        - booking.example.com
```

### External Database (AWS RDS)

```yaml
# external-db-values.yaml
postgresql:
  enabled: false

app:
  externalDatabase:
    enabled: true
    host: mydb.xxxxxxxxxxxx.us-west-2.rds.amazonaws.com
    port: 5432
    database: venue_booking
    username: dbuser
    existingSecret: venue-booking-db-secret  # Create this secret first
    existingSecretPasswordKey: password

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: booking.example.com
      paths:
        - path: /
          pathType: Prefix
```

Create the external database secret:
```bash
kubectl create secret generic venue-booking-db-secret \
  --from-literal=password='your-secure-password' \
  -n venue-booking
```

## 🔧 Upgrade

```bash
# Upgrade to new version
helm upgrade venue-booking \
  oci://ghcr.io/nidgetgod/venue-booking \
  --version 0.2.0 \
  --namespace venue-booking \
  --reuse-values

# Upgrade with new values
helm upgrade venue-booking \
  oci://ghcr.io/nidgetgod/venue-booking \
  --version 0.2.0 \
  -f updated-values.yaml \
  --namespace venue-booking
```

## 🗑️ Uninstall

```bash
# Uninstall the release
helm uninstall venue-booking -n venue-booking

# Note: PVCs are not deleted automatically
# Delete PVCs manually if needed
kubectl delete pvc -l cnpg.io/cluster=venue-booking-pg -n venue-booking
```

## 📖 Documentation

Full documentation is available in the repository:
- [Chart README](./helm/venue-booking/README.md) - Complete parameter reference (83 parameters)
- [Examples](./helm/venue-booking/examples/values-examples.yaml) - 7 configuration scenarios
- [GitHub Repository](https://github.com/nidgetgod/venue-booking)

## 🔄 Automated Releases

Charts are automatically published to GHCR when changes are pushed to the `main` branch via GitHub Actions.

## 📝 Chart Versions

| Chart Version | App Version | CNPG Version | Kubernetes | Release Date |
|---------------|-------------|--------------|------------|--------------|
| 0.1.0         | 1.0.0       | 0.26.1       | 1.24+      | 2025-11-17   |

## 🤝 Contributing

Issues and pull requests are welcome!

## 📄 License

This project follows the same license as the main application.
