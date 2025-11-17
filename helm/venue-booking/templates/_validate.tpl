{{/*
Validate database configuration
*/}}
{{- if and (not .Values.postgresql.enabled) (not .Values.app.externalDatabase.enabled) }}
{{- fail "Either postgresql.enabled or app.externalDatabase.enabled must be true" }}
{{- end }}

{{- if and .Values.postgresql.enabled .Values.app.externalDatabase.enabled }}
{{- fail "Only one of postgresql.enabled or app.externalDatabase.enabled can be true" }}
{{- end }}

{{- if .Values.app.externalDatabase.enabled }}
{{- if not .Values.app.externalDatabase.url }}
{{- if not .Values.app.externalDatabase.host }}
{{- fail "app.externalDatabase.host is required when using external database without url" }}
{{- end }}
{{- if not .Values.app.externalDatabase.database }}
{{- fail "app.externalDatabase.database is required when using external database without url" }}
{{- end }}
{{- if not .Values.app.externalDatabase.username }}
{{- fail "app.externalDatabase.username is required when using external database without url" }}
{{- end }}
{{- if and (not .Values.app.externalDatabase.password) (not .Values.app.externalDatabase.existingSecret) }}
{{- fail "Either app.externalDatabase.password or app.externalDatabase.existingSecret is required" }}
{{- end }}
{{- end }}
{{- end }}
