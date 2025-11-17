# venue-booking

![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.0.0](https://img.shields.io/badge/AppVersion-1.0.0-informational?style=flat-square)

A Helm chart for Venue Booking application with CloudNativePG

## Maintainers

| Name | Email | Url |
| ---- | ------ | --- |
| nidgetgod | <nidgetgod@plantchosen.com> |  |

## Source Code

* <https://github.com/nidgetgod/venue-booking>

## Requirements

| Repository | Name | Version |
|------------|------|---------|
| https://cloudnative-pg.github.io/charts | cloudnative-pg | 0.26.1 |

## Installation

### Prerequisites

Before installing this chart, ensure you have:

1. **Kubernetes cluster** (v1.24+)
2. **Helm 3.x** installed
3. **CloudNativePG Operator** installed in your cluster

### Installing CloudNativePG Operator

```bash
kubectl apply -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.24/releases/cnpg-1.24.0.yaml
```

Or using Helm:

```bash
helm repo add cnpg https://cloudnative-pg.github.io/charts
helm upgrade --install cnpg \
  --namespace cnpg-system \
  --create-namespace \
  cnpg/cloudnative-pg
```

### Install the Chart

```bash
# Add the repository (if published)
helm repo add venue-booking https://your-helm-repo.example.com
helm repo update

# Install with default values
helm install venue-booking venue-booking/venue-booking \
  --namespace venue-booking \
  --create-namespace

# Or install from local directory
helm install venue-booking . \
  --namespace venue-booking \
  --create-namespace \
  --set image.repository=your-registry/venue-booking \
  --set image.tag=v1.0.0
```

### Upgrade

```bash
helm upgrade venue-booking venue-booking/venue-booking \
  --namespace venue-booking \
  --reuse-values \
  --set image.tag=v1.1.0
```

### Uninstall

```bash
helm uninstall venue-booking --namespace venue-booking
```

## Configuration Examples

### Quick Start (Development)

```yaml
# values-dev.yaml
replicaCount: 1

ingress:
  enabled: false

postgresql:
  cluster:
    instances: 1
    storage:
      size: 5Gi
    backup:
      enabled: false
```

```bash
helm install venue-booking . -f values-dev.yaml
```

### Production with Internal PostgreSQL

```yaml
# values-prod.yaml
replicaCount: 3

image:
  repository: ghcr.io/your-org/venue-booking
  tag: "v1.0.0"

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10

ingress:
  enabled: true
  hosts:
    - host: booking.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: venue-booking-tls
      hosts:
        - booking.example.com

postgresql:
  cluster:
    instances: 3
    storage:
      size: 50Gi
      storageClass: "fast-ssd"
    backup:
      enabled: true
      retentionPolicy: "90d"
      s3:
        enabled: true
        bucket: "prod-backups"
        region: "us-east-1"
```

### External Database (AWS RDS)

```yaml
# values-external-db.yaml
postgresql:
  enabled: false

app:
  externalDatabase:
    enabled: true
    host: "mydb.abc123.us-east-1.rds.amazonaws.com"
    port: 5432
    database: "venue_booking"
    username: "dbadmin"
    existingSecret: "rds-credentials"
    sslMode: "require"
```

More examples available in the [examples](./examples/) directory.

## Database Configuration

This chart supports two database configuration modes:

### 1. Internal PostgreSQL (CloudNativePG)

**Default mode.** Deploys a highly available PostgreSQL cluster using CloudNativePG operator.

**Features:**
- High availability with 3 replicas (configurable)
- Automatic failover
- Point-in-time recovery
- Automated backups (local and S3)
- Prometheus monitoring

**Configuration:**
```yaml
postgresql:
  enabled: true
  cluster:
    instances: 3
    storage:
      size: 10Gi
```

### 2. External PostgreSQL

Connect to an existing PostgreSQL database (AWS RDS, Azure Database, etc.)

**Using individual parameters:**
```yaml
postgresql:
  enabled: false

app:
  externalDatabase:
    enabled: true
    host: "external-db.example.com"
    port: 5432
    database: "venue_booking"
    username: "dbuser"
    password: "secret"  # Use existingSecret instead
    sslMode: "require"
```

**Using complete URL:**
```yaml
app:
  externalDatabase:
    enabled: true
    url: "postgresql://user:pass@db.example.com:5432/mydb?sslmode=require"
```

**Using existing Secret (recommended):**
```yaml
app:
  externalDatabase:
    enabled: true
    host: "db.example.com"
    database: "venue_booking"
    username: "dbuser"
    existingSecret: "my-db-credentials"
    existingSecretPasswordKey: "password"
```

## Monitoring

### Prometheus Integration

The chart includes PodMonitor resources for Prometheus monitoring:

```yaml
postgresql:
  cluster:
    monitoring:
      enabled: true
      podMonitor:
        enabled: true
```

**Metrics available:**
- PostgreSQL cluster metrics
- Query performance
- Replication lag
- Connection pool stats

### Health Checks

Application health endpoints:
- Liveness: `/api/health`
- Readiness: `/api/health`

## Backup and Recovery

### Automated Backups

```yaml
postgresql:
  cluster:
    backup:
      enabled: true
      retentionPolicy: "30d"
      schedule: "0 2 * * *"  # Daily at 2 AM
```

### S3 Backups

```yaml
postgresql:
  cluster:
    backup:
      s3:
        enabled: true
        bucket: "my-backups"
        path: "venue-booking"
        endpointURL: "https://s3.amazonaws.com"
        region: "us-east-1"
        credentials:
          existingSecret: "aws-credentials"
```

### Manual Backup

```bash
kubectl apply -f - <<EOF
apiVersion: postgresql.cnpg.io/v1
kind: Backup
metadata:
  name: manual-backup-$(date +%Y%m%d-%H%M%S)
  namespace: venue-booking
spec:
  cluster:
    name: venue-booking-pg
EOF
```

### List Backups

```bash
kubectl get backups -n venue-booking
```

## Troubleshooting

### Check Pod Status

```bash
kubectl get pods -n venue-booking
kubectl logs -f deployment/venue-booking -n venue-booking
```

### Check PostgreSQL Cluster

```bash
kubectl get cluster -n venue-booking
kubectl describe cluster venue-booking-pg -n venue-booking
```

### Connect to Database

```bash
# Get password
kubectl get secret venue-booking-pg-app -n venue-booking \
  -o jsonpath='{.data.password}' | base64 -d

# Port-forward
kubectl port-forward -n venue-booking svc/venue-booking-pg-rw 5432:5432

# Connect
psql -h localhost -U venue_booking_user -d venue_booking
```

### Test Database Connection

```bash
kubectl exec -it deployment/venue-booking -n venue-booking -- \
  sh -c 'psql $DATABASE_URL -c "SELECT version();"'
```

## Security

### Best Practices

1. **Use existing secrets** for sensitive data instead of values.yaml
2. **Enable TLS/SSL** for database connections (`sslMode: require`)
3. **Use cert-manager** for automatic TLS certificate management
4. **Set resource limits** to prevent resource exhaustion
5. **Enable Pod Security Standards** (already configured)
6. **Use private registries** with imagePullSecrets

### Example Secret Creation

```bash
# Database password
kubectl create secret generic venue-booking-db-secret \
  --from-literal=password='YourSecurePassword123!' \
  -n venue-booking

# AWS S3 credentials
kubectl create secret generic aws-s3-credentials \
  --from-literal=ACCESS_KEY_ID='your-key' \
  --from-literal=SECRET_ACCESS_KEY='your-secret' \
  -n venue-booking
```

## ## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` | Affinity rules for pod assignment |
| app.env.NODE_ENV | string | `"production"` | Node environment (production, development, etc.) |
| app.externalDatabase | object | `{"database":"","enabled":false,"existingSecret":"","existingSecretPasswordKey":"password","host":"","password":"","port":5432,"sslMode":"require","url":"","username":""}` | External database configuration (used when postgresql.enabled = false) |
| app.externalDatabase.database | string | `""` | Database name |
| app.externalDatabase.enabled | bool | `false` | Enable external database connection |
| app.externalDatabase.existingSecret | string | `""` | Name of existing secret containing database password |
| app.externalDatabase.existingSecretPasswordKey | string | `"password"` | Key in the existing secret that contains the password |
| app.externalDatabase.host | string | `""` | Database host (if not using url) |
| app.externalDatabase.password | string | `""` | Database password (not recommended, use existingSecret instead) |
| app.externalDatabase.port | int | `5432` | Database port |
| app.externalDatabase.sslMode | string | `"require"` | SSL mode: disable, require, verify-ca, verify-full |
| app.externalDatabase.url | string | `""` | Full database URL (takes precedence if provided) |
| app.externalDatabase.username | string | `""` | Database username |
| app.extraEnv | list | `[]` | Additional environment variables to add to the container |
| autoscaling.enabled | bool | `false` | Enable Horizontal Pod Autoscaler |
| autoscaling.maxReplicas | int | `10` | Maximum number of replicas |
| autoscaling.minReplicas | int | `2` | Minimum number of replicas |
| autoscaling.targetCPUUtilizationPercentage | int | `80` | Target CPU utilization percentage |
| cloudnative-pg | object | `{"config":{"create":true},"monitoring":{"podMonitor":{"enabled":true}}}` | CloudNativePG Operator Configuration |
| cloudnative-pg.config | object | `{"create":true}` | Operator configuration |
| cloudnative-pg.config.create | bool | `true` | Create operator config |
| cloudnative-pg.monitoring | object | `{"podMonitor":{"enabled":true}}` | Monitoring configuration for CNPG operator |
| cloudnative-pg.monitoring.podMonitor.enabled | bool | `true` | Enable PodMonitor for CNPG operator |
| fullnameOverride | string | `""` | Override the full name of the release |
| image.pullPolicy | string | `"IfNotPresent"` | Image pull policy |
| image.repository | string | `"your-registry/venue-booking"` | Container image repository |
| image.tag | string | `"latest"` | Overrides the image tag whose default is the chart appVersion |
| imagePullSecrets | list | `[]` | Image pull secrets for private registries |
| ingress.annotations | object | `{"cert-manager.io/cluster-issuer":"letsencrypt-prod"}` | Additional annotations for the Ingress resource |
| ingress.className | string | `"nginx"` | Ingress class name |
| ingress.enabled | bool | `true` | Enable ingress controller resource |
| ingress.hosts | list | `[{"host":"venue-booking.example.com","paths":[{"path":"/","pathType":"Prefix"}]}]` | List of hosts for the ingress |
| ingress.tls | list | `[{"hosts":["venue-booking.example.com"],"secretName":"venue-booking-tls"}]` | TLS configuration for the ingress |
| nameOverride | string | `""` | Override the name of the chart |
| nodeSelector | object | `{}` | Node selector for pod assignment |
| podAnnotations | object | `{}` | Annotations to add to the pod |
| podSecurityContext.fsGroup | int | `2000` | FSGroup that owns the pod's volumes |
| postgresql.auth | object | `{"database":"venue_booking","existingSecret":"","password":"","secretKeys":{"userPasswordKey":"password"},"username":"venue_booking_user"}` | Database credentials configuration |
| postgresql.auth.database | string | `"venue_booking"` | PostgreSQL database name |
| postgresql.auth.existingSecret | string | `""` | Name of existing secret containing credentials |
| postgresql.auth.password | string | `""` | PostgreSQL password (auto-generated if empty) |
| postgresql.auth.secretKeys | object | `{"userPasswordKey":"password"}` | Keys for username and password in existing secret |
| postgresql.auth.username | string | `"venue_booking_user"` | PostgreSQL username |
| postgresql.cluster.backup.enabled | bool | `true` | Enable automated backups |
| postgresql.cluster.backup.retentionPolicy | string | `"30d"` | Backup retention policy (e.g., "30d", "7d") |
| postgresql.cluster.backup.s3 | object | `{"enabled":false}` | S3-compatible storage configuration for backups |
| postgresql.cluster.backup.s3.enabled | bool | `false` | Enable S3 backups |
| postgresql.cluster.backup.schedule | string | `"0 2 * * *"` | Backup schedule in cron format |
| postgresql.cluster.bootstrap | object | `{"initdb":{"database":"venue_booking","owner":"venue_booking_user","secret":{"name":"venue-booking-pg-app"}}}` | Database initialization configuration |
| postgresql.cluster.bootstrap.initdb.database | string | `"venue_booking"` | Database name to create |
| postgresql.cluster.bootstrap.initdb.owner | string | `"venue_booking_user"` | Database owner |
| postgresql.cluster.bootstrap.initdb.secret | object | `{"name":"venue-booking-pg-app"}` | Secret containing initial credentials |
| postgresql.cluster.imageName | string | `"ghcr.io/cloudnative-pg/postgresql:16.2"` | PostgreSQL container image |
| postgresql.cluster.instances | int | `3` | Number of PostgreSQL instances in the cluster |
| postgresql.cluster.monitoring | object | `{"enabled":true,"podMonitor":{"enabled":true}}` | Monitoring configuration |
| postgresql.cluster.monitoring.enabled | bool | `true` | Enable monitoring |
| postgresql.cluster.monitoring.podMonitor.enabled | bool | `true` | Enable Prometheus PodMonitor |
| postgresql.cluster.name | string | `"venue-booking-pg"` | Name of the PostgreSQL cluster |
| postgresql.cluster.postgresql | object | `{"parameters":{"checkpoint_completion_target":"0.9","default_statistics_target":"100","effective_cache_size":"1GB","effective_io_concurrency":"200","maintenance_work_mem":"64MB","max_connections":"200","max_wal_size":"4GB","min_wal_size":"1GB","random_page_cost":"1.1","shared_buffers":"256MB","wal_buffers":"16MB","work_mem":"1310kB"}}` | PostgreSQL configuration parameters |
| postgresql.cluster.postgresql.parameters | object | `{"checkpoint_completion_target":"0.9","default_statistics_target":"100","effective_cache_size":"1GB","effective_io_concurrency":"200","maintenance_work_mem":"64MB","max_connections":"200","max_wal_size":"4GB","min_wal_size":"1GB","random_page_cost":"1.1","shared_buffers":"256MB","wal_buffers":"16MB","work_mem":"1310kB"}` | PostgreSQL server parameters |
| postgresql.cluster.resources | object | `{"limits":{"cpu":"2000m","memory":"2Gi"},"requests":{"cpu":"500m","memory":"512Mi"}}` | Resource requests and limits for PostgreSQL pods |
| postgresql.cluster.storage.size | string | `"10Gi"` | Size of the persistent volume for each PostgreSQL instance |
| postgresql.cluster.storage.storageClass | string | `""` | Storage class name. Empty string uses default storage class |
| postgresql.enabled | bool | `true` | Enable internal PostgreSQL cluster using CloudNativePG operator |
| postgresql.sslMode | string | `"prefer"` | SSL mode for internal PostgreSQL: disable, prefer, require |
| replicaCount | int | `2` | Number of replicas for the venue-booking deployment |
| resources | object | `{"limits":{"cpu":"1000m","memory":"512Mi"},"requests":{"cpu":"100m","memory":"256Mi"}}` | Resource requests and limits for the venue-booking pods |
| securityContext.capabilities.drop | list | `["ALL"]` | Linux capabilities to drop |
| securityContext.readOnlyRootFilesystem | bool | `false` | Mount root filesystem as read-only |
| securityContext.runAsNonRoot | bool | `true` | Run container as non-root user |
| securityContext.runAsUser | int | `1000` | User ID to run the container |
| service.port | int | `3000` | Service port |
| service.targetPort | int | `3000` | Container target port |
| service.type | string | `"ClusterIP"` | Kubernetes service type |
| serviceAccount.annotations | object | `{}` | Annotations to add to the service account |
| serviceAccount.create | bool | `true` | Specifies whether a service account should be created |
| serviceAccount.name | string | `""` | The name of the service account to use. If not set and create is true, a name is generated using the fullname template |
| tolerations | list | `[]` | Tolerations for pod assignment |

----------------------------------------------
Autogenerated from chart metadata using [helm-docs v1.14.2](https://github.com/norwoodj/helm-docs/releases/v1.14.2)
