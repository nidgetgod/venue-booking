{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "venue-booking.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "venue-booking.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "venue-booking.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "venue-booking.labels" -}}
helm.sh/chart: {{ include "venue-booking.chart" . }}
{{ include "venue-booking.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "venue-booking.selectorLabels" -}}
app.kubernetes.io/name: {{ include "venue-booking.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "venue-booking.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "venue-booking.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
PostgreSQL connection URL
*/}}
{{- define "venue-booking.databaseUrl" -}}
{{- if .Values.postgresql.enabled }}
{{- $sslMode := .Values.postgresql.sslMode | default "prefer" }}
{{- printf "postgresql://%s:$(DATABASE_PASSWORD)@%s-rw.%s.svc.cluster.local:5432/%s?sslmode=%s" .Values.postgresql.auth.username .Values.postgresql.cluster.name .Release.Namespace .Values.postgresql.auth.database $sslMode }}
{{- else if .Values.app.externalDatabase.enabled }}
{{- if .Values.app.externalDatabase.url }}
{{- .Values.app.externalDatabase.url }}
{{- else }}
{{- $sslMode := .Values.app.externalDatabase.sslMode | default "require" }}
{{- printf "postgresql://%s:$(DATABASE_PASSWORD)@%s:%v/%s?sslmode=%s" .Values.app.externalDatabase.username .Values.app.externalDatabase.host (.Values.app.externalDatabase.port | int) .Values.app.externalDatabase.database $sslMode }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Database host
*/}}
{{- define "venue-booking.databaseHost" -}}
{{- if .Values.postgresql.enabled }}
{{- printf "%s-rw.%s.svc.cluster.local" .Values.postgresql.cluster.name .Release.Namespace }}
{{- else if .Values.app.externalDatabase.enabled }}
{{- .Values.app.externalDatabase.host }}
{{- end }}
{{- end }}

{{/*
Database port
*/}}
{{- define "venue-booking.databasePort" -}}
{{- if .Values.postgresql.enabled }}
{{- print "5432" }}
{{- else if .Values.app.externalDatabase.enabled }}
{{- .Values.app.externalDatabase.port | toString }}
{{- end }}
{{- end }}

{{/*
Database name
*/}}
{{- define "venue-booking.databaseName" -}}
{{- if .Values.postgresql.enabled }}
{{- .Values.postgresql.auth.database }}
{{- else if .Values.app.externalDatabase.enabled }}
{{- .Values.app.externalDatabase.database }}
{{- end }}
{{- end }}

{{/*
Database username
*/}}
{{- define "venue-booking.databaseUsername" -}}
{{- if .Values.postgresql.enabled }}
{{- .Values.postgresql.auth.username }}
{{- else if .Values.app.externalDatabase.enabled }}
{{- .Values.app.externalDatabase.username }}
{{- end }}
{{- end }}

{{/*
Database secret name
*/}}
{{- define "venue-booking.databaseSecretName" -}}
{{- if .Values.postgresql.enabled }}
{{- printf "%s-pg-app" (include "venue-booking.fullname" .) }}
{{- else if .Values.app.externalDatabase.enabled }}
{{- if .Values.app.externalDatabase.existingSecret }}
{{- .Values.app.externalDatabase.existingSecret }}
{{- else }}
{{- printf "%s-external-db" (include "venue-booking.fullname" .) }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Database secret password key
*/}}
{{- define "venue-booking.databaseSecretPasswordKey" -}}
{{- if .Values.postgresql.enabled }}
{{- print "password" }}
{{- else if .Values.app.externalDatabase.enabled }}
{{- .Values.app.externalDatabase.existingSecretPasswordKey | default "password" }}
{{- end }}
{{- end }}
