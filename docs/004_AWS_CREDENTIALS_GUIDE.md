# 🔐 AWS Credentials Configuration Guide

> Best practices for configuring AWS credentials for the Book-Me-Now application (2025)

## Overview

AWS credentials allow your application to authenticate with AWS services. This guide covers:
- Local development setup
- Production deployment configuration
- Security best practices
- Credential rotation strategies

## 📁 Understanding AWS Credential Files

### File Locations

**macOS/Linux:**
```
~/.aws/credentials  # Contains access keys
~/.aws/config       # Contains region and output settings
```

**Windows:**
```
C:\Users\USERNAME\.aws\credentials
C:\Users\USERNAME\.aws\config
```

## 🔧 Local Development Setup

### Method 1: AWS CLI Configuration (Recommended)

```bash
# Install AWS CLI
brew install awscli  # macOS
# or
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Configure credentials
aws configure --profile bookmenow
```

Enter when prompted:
```
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: ap-southeast-1
Default output format [None]: json
```

### Method 2: Manual File Configuration

#### Create `~/.aws/credentials`:

```ini
[default]
aws_access_key_id = YOUR_DEFAULT_ACCESS_KEY
aws_secret_access_key = YOUR_DEFAULT_SECRET_KEY

[bookmenow]
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

[bookmenow-staging]
aws_access_key_id = STAGING_ACCESS_KEY
aws_secret_access_key = STAGING_SECRET_KEY

[bookmenow-prod]
aws_access_key_id = PRODUCTION_ACCESS_KEY
aws_secret_access_key = PRODUCTION_SECRET_KEY
```

#### Create `~/.aws/config`:

```ini
[default]
region = ap-southeast-1
output = json

[profile bookmenow]
region = ap-southeast-1
output = json
cli_timestamp_format = iso8601
cli_follow_urlparam = true

[profile bookmenow-staging]
region = ap-southeast-1
output = json
source_profile = bookmenow
role_arn = arn:aws:iam::123456789012:role/BookMeNowStagingRole

[profile bookmenow-prod]
region = ap-southeast-1
output = json
source_profile = bookmenow
role_arn = arn:aws:iam::123456789012:role/BookMeNowProductionRole
```

## 🚀 Using Profiles in Your Application

### In Next.js Application

#### Option 1: Environment Variables

`.env.local`:
```env
AWS_PROFILE=bookmenow
AWS_SDK_LOAD_CONFIG=1
```

#### Option 2: SDK Configuration

```typescript
// lib/aws-config.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { fromIni } from "@aws-sdk/credential-provider-ini";

// Use specific profile
const credentials = fromIni({ profile: 'bookmenow' });

export const dynamoClient = new DynamoDBClient({
  region: 'ap-southeast-1',
  credentials
});

export const s3Client = new S3Client({
  region: 'ap-southeast-1',
  credentials
});

export const cognitoClient = new CognitoIdentityProviderClient({
  region: 'ap-southeast-1',
  credentials
});
```

#### Option 3: Environment-based Configuration

```typescript
// lib/aws-config.ts
const getAWSConfig = () => {
  const env = process.env.NODE_ENV;

  if (env === 'development') {
    return {
      region: 'ap-southeast-1',
      credentials: fromIni({ profile: 'bookmenow' })
    };
  }

  // Production uses IAM roles (no explicit credentials)
  return {
    region: process.env.AWS_REGION || 'ap-southeast-1'
  };
};

export const dynamoClient = new DynamoDBClient(getAWSConfig());
```

## 🔄 Credential Provider Chain

AWS SDK automatically checks for credentials in this order:

1. **Environment variables**
   ```bash
   AWS_ACCESS_KEY_ID=xxx
   AWS_SECRET_ACCESS_KEY=xxx
   AWS_SESSION_TOKEN=xxx (optional)
   ```

2. **Shared credentials file**
   ```
   ~/.aws/credentials
   ```

3. **AWS IAM roles** (EC2, Lambda, ECS)
   - Automatic for AWS services
   - No credentials needed in code

4. **AWS SSO** (Recommended for teams)
   ```bash
   aws sso login --profile bookmenow
   ```

## 🛡️ Security Best Practices

### 1. Never Commit Credentials

`.gitignore`:
```gitignore
# AWS
.aws/
*.pem
*.key

# Environment variables
.env
.env.local
.env.production
.env*.local

# AWS CDK
cdk.out/
```

### 2. Use Temporary Credentials

```bash
# Assume role with temporary credentials
aws sts assume-role \
  --role-arn arn:aws:iam::123456789012:role/BookMeNowDev \
  --role-session-name bookmenow-session \
  --profile bookmenow
```

### 3. Rotate Access Keys Regularly

```bash
# Create new access key
aws iam create-access-key --user-name bookmenow-dev

# List existing keys
aws iam list-access-keys --user-name bookmenow-dev

# Delete old key
aws iam delete-access-key \
  --access-key-id OLDACCESSKEYID \
  --user-name bookmenow-dev
```

### 4. Use AWS SSO for Teams

```bash
# Configure SSO
aws configure sso --profile bookmenow-sso

# Login
aws sso login --profile bookmenow-sso

# Use profile
export AWS_PROFILE=bookmenow-sso
```

## 🏭 Production Deployment

### Vercel Deployment

Add these environment variables in Vercel Dashboard:

```env
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=ap-southeast-1
```

### AWS Amplify Deployment

Amplify automatically uses IAM roles. Configure in `amplify.yml`:

```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - npm ci
        - npx cdk deploy --require-approval never
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

# Use build args for credentials (build time only)
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

# Set as env vars (runtime)
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV AWS_REGION=ap-southeast-1

# ... rest of Dockerfile
```

Build with:
```bash
docker build \
  --build-arg AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  --build-arg AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  -t bookmenow .
```

## 🔍 Testing Credentials

### Test AWS CLI Access

```bash
# Test with specific profile
aws sts get-caller-identity --profile bookmenow

# Should return:
{
    "UserId": "AIDACKCEVSQ6C2EXAMPLE",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/bookmenow-dev"
}
```

### Test Service Access

```bash
# Test DynamoDB
aws dynamodb list-tables --profile bookmenow

# Test S3
aws s3 ls --profile bookmenow

# Test Cognito
aws cognito-idp list-user-pools --max-results 10 --profile bookmenow
```

### Test in Node.js

```javascript
// test-credentials.js
const { DynamoDBClient, ListTablesCommand } = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-provider-ini");

async function testCredentials() {
  const client = new DynamoDBClient({
    region: 'ap-southeast-1',
    credentials: fromIni({ profile: 'bookmenow' })
  });

  try {
    const command = new ListTablesCommand({});
    const response = await client.send(command);
    console.log('✅ Credentials working! Tables:', response.TableNames);
  } catch (error) {
    console.error('❌ Credential error:', error.message);
  }
}

testCredentials();
```

Run: `node test-credentials.js`

## 🚨 Troubleshooting

### Common Issues

#### 1. "Unable to locate credentials"

```bash
# Check if credentials file exists
ls -la ~/.aws/

# Verify profile name
aws configure list --profile bookmenow

# Set profile explicitly
export AWS_PROFILE=bookmenow
```

#### 2. "Invalid security token"

```bash
# Token might be expired, refresh:
aws sso login --profile bookmenow

# Or get new credentials:
aws configure --profile bookmenow
```

#### 3. "Access Denied"

```bash
# Check IAM permissions
aws iam get-user --profile bookmenow

# List attached policies
aws iam list-attached-user-policies \
  --user-name bookmenow-dev \
  --profile bookmenow
```

#### 4. Profile Not Found

```bash
# List all profiles
aws configure list-profiles

# Check config file
cat ~/.aws/config | grep profile
```

## 📊 Monitoring Credential Usage

### Enable CloudTrail

```bash
# Check credential usage
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=UserName,AttributeValue=bookmenow-dev \
  --profile bookmenow
```

### Set Up Access Analyzer

```bash
# Create analyzer
aws accessanalyzer create-analyzer \
  --analyzer-name bookmenow-analyzer \
  --type ACCOUNT \
  --profile bookmenow
```

## 🔄 Credential Rotation Script

```bash
#!/bin/bash
# rotate-credentials.sh

PROFILE="bookmenow"
USER="bookmenow-dev"

echo "🔄 Rotating AWS credentials for $USER"

# Create new access key
NEW_KEY=$(aws iam create-access-key --user-name $USER --profile $PROFILE)

# Extract key details
ACCESS_KEY=$(echo $NEW_KEY | jq -r '.AccessKey.AccessKeyId')
SECRET_KEY=$(echo $NEW_KEY | jq -r '.AccessKey.SecretAccessKey')

# Update local credentials
aws configure set aws_access_key_id $ACCESS_KEY --profile $PROFILE
aws configure set aws_secret_access_key $SECRET_KEY --profile $PROFILE

echo "✅ New credentials configured"
echo "⚠️  Remember to update production environment variables!"
```

## 🎯 Quick Reference

### Essential Commands

```bash
# Configure profile
aws configure --profile bookmenow

# Test credentials
aws sts get-caller-identity --profile bookmenow

# Use profile
export AWS_PROFILE=bookmenow

# List profiles
aws configure list-profiles

# Show current configuration
aws configure list --profile bookmenow
```

### Environment Variables

```bash
# For development
export AWS_PROFILE=bookmenow
export AWS_REGION=ap-southeast-1
export AWS_SDK_LOAD_CONFIG=1

# For CI/CD
export AWS_ACCESS_KEY_ID=xxx
export AWS_SECRET_ACCESS_KEY=xxx
export AWS_DEFAULT_REGION=ap-southeast-1
```

---

*Last Updated: January 2025 | Part of Book-Me-Now AWS Setup*