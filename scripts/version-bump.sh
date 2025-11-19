#!/bin/bash
# Version bump script for venue-booking
# Updates version in package.json, Chart.yaml, and values.yaml

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get the current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_info "Current version: ${CURRENT_VERSION}"

# Parse arguments
if [ $# -eq 0 ]; then
    print_error "Usage: $0 <new_version>"
    print_error "Example: $0 1.2.2"
    exit 1
fi

NEW_VERSION=$1

# Validate version format (semantic versioning)
if ! [[ $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$ ]]; then
    print_error "Invalid version format. Please use semantic versioning (e.g., 1.2.3 or 1.2.3-beta.1)"
    exit 1
fi

print_info "Bumping version to: ${NEW_VERSION}"

# Update package.json
print_info "Updating package.json..."
if command -v jq &> /dev/null; then
    # Use jq if available
    jq --arg ver "$NEW_VERSION" '.version = $ver' package.json > package.json.tmp && mv package.json.tmp package.json
else
    # Fallback to sed
    sed -i.bak "s/\"version\": \".*\"/\"version\": \"${NEW_VERSION}\"/" package.json && rm package.json.bak
fi

# Update Chart.yaml
print_info "Updating charts/venue-booking/Chart.yaml..."
sed -i.bak -e "s/^version: .*/version: ${NEW_VERSION}/" \
           -e "s/^appVersion: .*/appVersion: \"${NEW_VERSION}\"/" \
           charts/venue-booking/Chart.yaml && rm charts/venue-booking/Chart.yaml.bak

# Update values.yaml image tag
print_info "Updating charts/venue-booking/values.yaml..."
sed -i.bak "s/tag: \"v.*\"/tag: \"v${NEW_VERSION}\"/" charts/venue-booking/values.yaml && rm charts/venue-booking/values.yaml.bak

# Verify changes
print_info "Verifying changes..."
echo ""
echo "package.json version: $(node -p \"require('./package.json').version\")"
echo "Chart.yaml version: $(grep '^version:' charts/venue-booking/Chart.yaml | awk '{print $2}')"
echo "Chart.yaml appVersion: $(grep '^appVersion:' charts/venue-booking/Chart.yaml | awk '{print $2}')"
echo "values.yaml image.tag: $(grep 'tag:' charts/venue-booking/values.yaml | grep -v '#' | awk '{print $2}')"
echo ""

print_info "Version bump complete! ✅"
print_warning "Next steps:"
echo "  1. Review the changes: git diff"
echo "  2. Commit the changes: git add . && git commit -m \"chore: bump version to ${NEW_VERSION}\""
echo "  3. Build and package: make version-release VERSION=${NEW_VERSION}"
echo "  4. Create a git tag: git tag v${NEW_VERSION} && git push origin v${NEW_VERSION}"
