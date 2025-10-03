import { db } from "@/firebase/admin";

export async function GET() {
  try {
    console.log("Testing Firestore connection...");
    
    // Test 1: Try to read from a collection
    console.log("Test 1: Reading from Firestore...");
    const testCollection = db.collection("test");
    const snapshot = await testCollection.limit(1).get();
    console.log("Read test successful, documents found:", snapshot.size);
    
    // Test 2: Try to write a simple document
    console.log("Test 2: Writing to Firestore...");
    const testDoc = await testCollection.add({
      timestamp: new Date().toISOString(),
      message: "Firestore test successful"
    });
    console.log("Write test successful, document ID:", testDoc.id);
    
    // Test 3: Try to read the document we just wrote
    console.log("Test 3: Reading the document we just wrote...");
    const docSnapshot = await testDoc.get();
    console.log("Read back test successful, document exists:", docSnapshot.exists);
    
    // Clean up
    await testDoc.delete();
    console.log("Cleanup successful");
    
    return Response.json({ 
      success: true, 
      message: "All Firestore tests passed",
      projectId: "ai-interviewer-f86b9"
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Firestore test failed:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    return Response.json({ 
      success: false, 
      error: error.message,
      code: error.code,
      projectId: "ai-interviewer-f86b9"
    }, { status: 500 });
  }
}
