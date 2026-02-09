





//to be done






// import { supabaseAdmin } from '@/lib/supabaseAdmin';
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// export async function backupDataToS3() {
//   try {
//     console.log("Fetching data from Supabase...");

//     // 1. Fetch data from all 3 tables in parallel
//     const [sessions, likes, profiles] = await Promise.all([
//       supabaseAdmin.from('sessions').select('*'),
//       supabaseAdmin.from('likes').select('*'),
//       supabaseAdmin.from('profiles').select('*'),
//     ]);

//     // Check for errors in any of the fetches
//     if (sessions.error) throw sessions.error;
//     if (likes.error) throw likes.error;
//     if (profiles.error) throw profiles.error;

//     // 2. Prepare the JSON bundle
//     const backupData = {
//       timestamp: new Date().toISOString(),
//       data: {
//         sessions: sessions.data,
//         likes: likes.data,
//         profiles: profiles.data,
//       }
//     };

//     const fileName = `backups/backup-${Date.now()}.json`;

//     // 3. Upload to S3
//     const uploadParams = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: fileName,
//       Body: JSON.stringify(backupData, null, 2),
//       ContentType: "application/json",
//     };

//     await s3Client.send(new PutObjectCommand(uploadParams));

//     console.log(`Successfully uploaded backup to ${fileName}`);
//     return { success: true, file: fileName };

//   } catch (err) {
//     console.error("Backup failed:", err.message);
//     throw err;
//   }
// }








