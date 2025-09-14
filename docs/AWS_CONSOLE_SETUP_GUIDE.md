# 📋 AWS Console Setup Guide for Book-Me-Now

> Complete step-by-step guide to set up AWS services via the AWS Console for the Book-Me-Now application (2025)

## Prerequisites

- AWS Account (create one at https://aws.amazon.com if you don't have one)
- Credit card for billing (services will cost < $50/month)
- Basic understanding of AWS services
- Node.js 18+ installed locally
- AWS CLI installed (`brew install awscli` on macOS)

## 🔐 Phase 1: IAM Setup and Credentials

### Step 1: Create IAM User

1. **Navigate to IAM Console**
   - Go to AWS Console → Services → IAM
   - Or direct link: https://console.aws.amazon.com/iam

2. **Create New User**
   - Click `Users` in left sidebar
   - Click `Create user` button
   - Username: `bookmenow-dev`
   - Check ✅ `Provide user access to the AWS Management Console`
   - Select `I want to create an IAM user`
   - Custom password: Set a strong password
   - Uncheck `Users must create a new password at next sign-in`
   - Click `Next`

3. **Set Permissions**
   - Select `Attach policies directly`
   - Search and select these policies:
     - `AmazonDynamoDBFullAccess`
     - `AmazonS3FullAccess`
     - `AmazonCognitoPowerUser`
     - `CloudFrontFullAccess`
     - `AWSCloudFormationFullAccess` (for CDK)
   - Click `Next`
   - Review and click `Create user`

4. **Generate Access Keys**
   - Click on the newly created user `bookmenow-dev`
   - Go to `Security credentials` tab
   - Under `Access keys`, click `Create access key`
   - Select `Command Line Interface (CLI)`
   - Check the confirmation checkbox
   - Click `Next`
   - Description tag: `bookmenow-local-dev`
   - Click `Create access key`
   - **IMPORTANT**: Download the CSV file or copy:
     - Access key ID
     - Secret access key
   - Store these securely - you won't see the secret again!

### Step 2: Configure AWS CLI

```bash
# Configure AWS CLI with your credentials
aws configure --profile bookmenow

# Enter when prompted:
AWS Access Key ID: [Your Access Key ID]
AWS Secret Access Key: [Your Secret Access Key]
Default region name: ap-southeast-1
Default output format: json
```

Your credentials will be stored in:
- `~/.aws/credentials` - Contains access keys
- `~/.aws/config` - Contains region and output settings

## 🗄️ Phase 2: DynamoDB Setup

### Step 1: Navigate to DynamoDB

1. Go to AWS Console → Services → DynamoDB
2. Or direct: https://console.aws.amazon.com/dynamodbv2
3. Select your region: `ap-southeast-1` (Asia Pacific - Singapore)

### Step 2: Create Main Table

1. **Click `Create table`**

2. **Table Details:**
   - Table name: `BookMeNow-Main`
   - Partition key: `PK` (Type: String)
   - Sort key: `SK` (Type: String)

3. **Table Settings:**
   - Select `Customize settings`
   - Table class: `DynamoDB Standard`
   - Capacity mode: `On-demand` ✅
   - Encryption: `AWS owned key` (default)

4. **Secondary Indexes:**

   Click `Create global secondary index` and add:

   **GSI1 (for location-based search):**
   - Partition key: `GSI1PK` (String)
   - Sort key: `GSI1SK` (String)
   - Index name: `GSI1`
   - Projection: `All`

   **GSI2 (for date-based queries):**
   - Click `Create global secondary index` again
   - Partition key: `GSI2PK` (String)
   - Sort key: `GSI2SK` (String)
   - Index name: `GSI2`
   - Projection: `All`

5. **Create Table:**
   - Review settings
   - Click `Create table`
   - Wait for status to become `Active` (~30 seconds)

### Step 3: Note Table ARN

1. Click on your table name `BookMeNow-Main`
2. Go to `Overview` tab
3. Copy the `Amazon Resource Name (ARN)`
4. Save for later use in environment variables

## 🪣 Phase 3: S3 Bucket Setup

### Step 1: Create S3 Bucket

1. **Navigate to S3**
   - AWS Console → Services → S3
   - Or: https://s3.console.aws.amazon.com/s3

2. **Create Bucket**
   - Click `Create bucket`
   - Bucket name: `bookmenow-images-[your-unique-id]`
     - Replace [your-unique-id] with something unique (e.g., your name + date)
     - Example: `bookmenow-images-wayne-2025`
   - Region: `Asia Pacific (Singapore) ap-southeast-1`

3. **Configure Options**
   - Object Ownership: `ACLs disabled (recommended)`
   - Block Public Access: ✅ `Block all public access` (Keep enabled!)
   - Bucket Versioning: `Enable`
   - Tags (optional):
     - Key: `Project`, Value: `BookMeNow`
   - Encryption: `Server-side encryption with Amazon S3 managed keys (SSE-S3)`

4. **Create Bucket**
   - Review and click `Create bucket`

### Step 2: Configure CORS

1. Click on your newly created bucket
2. Go to `Permissions` tab
3. Scroll to `Cross-origin resource sharing (CORS)`
4. Click `Edit`
5. Paste this CORS configuration:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE",
            "HEAD"
        ],
        "AllowedOrigins": [
            "http://localhost:3000",
            "https://localhost:3000",
            "https://your-production-domain.com"
        ],
        "ExposeHeaders": [
            "ETag"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

6. Click `Save changes`

## 🌐 Phase 4: CloudFront Setup

### Step 1: Create Distribution

1. **Navigate to CloudFront**
   - AWS Console → Services → CloudFront
   - Or: https://console.aws.amazon.com/cloudfront

2. **Create Distribution**
   - Click `Create distribution`

3. **Origin Settings**
   - Origin domain: Select your S3 bucket from dropdown
   - Origin path: Leave empty
   - Name: `bookmenow-s3-origin`
   - S3 bucket access: `Yes use OAC (recommended)`
   - Click `Create new OAC`
     - Name: `bookmenow-oac`
     - Click `Create`

4. **Default Cache Behavior**
   - Viewer protocol policy: `Redirect HTTP to HTTPS`
   - Allowed HTTP methods: `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`
   - Cache policy: `CachingOptimized`
   - Origin request policy: `CORS-S3Origin`

5. **Distribution Settings**
   - Price class: `Use only North America and Europe`
   - Alternate domain name (CNAME): Leave empty for now
   - Custom SSL certificate: Leave default
   - Description: `BookMeNow Image CDN`

6. **Create Distribution**
   - Click `Create distribution`
   - Copy the Distribution ID and Domain name
   - Status will show `Deploying` (takes ~15 minutes)

### Step 2: Update S3 Bucket Policy

1. After CloudFront creation, you'll see a blue banner
2. Click `Copy policy` button
3. Go back to S3 → Your bucket → Permissions
4. Under `Bucket policy`, click `Edit`
5. Paste the copied policy
6. Click `Save changes`

## 🔑 Phase 5: Cognito Setup

### Step 1: Create User Pool

1. **Navigate to Cognito**
   - AWS Console → Services → Cognito
   - Or: https://console.aws.amazon.com/cognito

2. **Create User Pool**
   - Click `Create user pool`

3. **Configure Sign-in Experience**
   - Authentication providers: `Cognito user pool`
   - Cognito user pool sign-in options:
     - ✅ Email
     - ✅ Username
   - User name requirements:
     - ✅ Allow users to sign in with a preferred user name
   - Click `Next`

4. **Configure Security Requirements**
   - Password policy mode: `Custom`
   - Password minimum length: `8`
   - Password requirements:
     - ✅ Contains at least 1 lowercase letter
     - ✅ Contains at least 1 uppercase letter
     - ✅ Contains at least 1 number
   - Multi-factor authentication: `Optional MFA`
   - MFA methods: `Authenticator apps`
   - Click `Next`

5. **Configure Sign-up Experience**
   - Self-registration: `Enable self-registration`
   - Attribute verification: `Send verification code to email`
   - Required attributes:
     - ✅ email
     - ✅ name
   - Custom attributes: Skip for now
   - Click `Next`

6. **Configure Message Delivery**
   - Email provider: `Send email with Cognito`
   - FROM email address: `no-reply@verificationemail.com`
   - Reply-to email: Your email
   - Click `Next`

7. **Integrate Your App**
   - User pool name: `BookMeNow-UserPool`
   - Hosted authentication pages: ✅ `Use Cognito Hosted UI`
   - Domain type: `Use a Cognito domain`
   - Cognito domain: `bookmenow-[unique-id]`
     - Example: `bookmenow-wayne-2025`

8. **Initial App Client**
   - App type: `Public client`
   - App client name: `bookmenow-web`
   - Client secret: `Generate a client secret`
   - Allowed callback URLs:
     ```
     http://localhost:3000/api/auth/callback/cognito
     https://your-production-domain.com/api/auth/callback/cognito
     ```
   - Allowed sign-out URLs:
     ```
     http://localhost:3000
     https://your-production-domain.com
     ```
   - Identity providers: `Cognito user pool`
   - OAuth 2.0 grant types:
     - ✅ Authorization code grant
   - OpenID Connect scopes:
     - ✅ OpenID
     - ✅ Email
     - ✅ Profile

9. **Review and Create**
   - Review all settings
   - Click `Create user pool`

### Step 2: Save Important Values

After creation, note these values:
1. User pool ID: `ap-southeast-1_XXXXXXXXX`
2. App client ID: Found in App Integration → App clients
3. App client secret: Click `Show client secret`
4. Cognito domain: Your full domain URL

## 📝 Phase 6: Environment Variables Setup

Create `.env.local` in your Next.js project root:

```env
# AWS Credentials (for local development only)
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# DynamoDB
DYNAMODB_TABLE_NAME=BookMeNow-Main
DYNAMODB_REGION=ap-southeast-1

# S3 & CloudFront
S3_BUCKET_NAME=bookmenow-images-[your-unique-id]
S3_REGION=ap-southeast-1
CLOUDFRONT_DOMAIN=https://[your-cf-distribution].cloudfront.net

# Cognito
COGNITO_CLIENT_ID=your_app_client_id
COGNITO_CLIENT_SECRET=your_app_client_secret
COGNITO_ISSUER=https://cognito-idp.ap-southeast-1.amazonaws.com/[your-user-pool-id]
COGNITO_USER_POOL_ID=ap-southeast-1_XXXXXXXXX

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-32-char-string

# Stripe (from your existing setup)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_KEY=your_stripe_publishable_key
```

## ✅ Phase 7: Verification Steps

### Test DynamoDB Connection

```bash
# Test table access
aws dynamodb describe-table \
  --table-name BookMeNow-Main \
  --profile bookmenow
```

### Test S3 Access

```bash
# List bucket contents
aws s3 ls s3://bookmenow-images-[your-unique-id]/ \
  --profile bookmenow
```

### Test CloudFront

```bash
# Get distribution status
aws cloudfront get-distribution \
  --id [YOUR-DISTRIBUTION-ID] \
  --profile bookmenow
```

### Test Cognito

```bash
# Describe user pool
aws cognito-idp describe-user-pool \
  --user-pool-id [YOUR-USER-POOL-ID] \
  --profile bookmenow
```

## 🚀 Next Steps

1. **CDK Setup** (Optional but recommended)
   - Install CDK: `npm install -g aws-cdk`
   - Bootstrap CDK: `cdk bootstrap --profile bookmenow`
   - Deploy infrastructure as code

2. **Integrate with Next.js**
   - Set up NextAuth with Cognito
   - Configure AWS SDK clients
   - Implement API routes with DynamoDB
   - Set up image upload to S3

3. **Security Hardening**
   - Enable MFA for IAM user
   - Rotate access keys regularly
   - Set up CloudWatch alarms
   - Configure WAF for CloudFront

## 💰 Cost Monitoring

Set up billing alerts:
1. Go to AWS Billing Dashboard
2. Set up a billing alarm for $50/month
3. Enable Cost Explorer
4. Tag all resources with `Project: BookMeNow`

## 🆘 Troubleshooting

### Common Issues:

1. **Access Denied Errors**
   - Check IAM user permissions
   - Verify AWS profile is correct
   - Ensure region matches

2. **CORS Errors**
   - Update S3 CORS configuration
   - Check CloudFront cache behaviors
   - Verify origin request policy

3. **Cognito Callback Issues**
   - Ensure callback URLs match exactly
   - Check client secret configuration
   - Verify NextAuth configuration

## 📚 Resources

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/v2/guide/home.html)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [S3 Security Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html)
- [Cognito with NextAuth](https://next-auth.js.org/providers/cognito)

---

*Last Updated: January 2025 | Aligned with Book-Me-Now REALISTIC_AWS_PLAN.md*