"use server";

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';
import connectDB from '@/lib/mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; recordingId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: practiceId, recordingId } = params;

    if (!practiceId || !recordingId) {
      return NextResponse.json({ error: 'Practice ID and Recording ID are required' }, { status: 400 });
    }

    const mongoose = await connectDB();
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection not found.');
    }

    // Verify that the recording belongs to the practice and the user
    const recording = await db.collection('recordings').findOne({
      _id: new ObjectId(recordingId),
      practiceId: new ObjectId(practiceId),
      userEmail: session.user.email,
    });

    if (!recording) {
      return NextResponse.json({ error: 'Recording not found or unauthorized' }, { status: 404 });
    }

    // Delete the recording
    const result = await db.collection('recordings').deleteOne({
      _id: new ObjectId(recordingId),
      practiceId: new ObjectId(practiceId),
      userEmail: session.user.email,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Failed to delete recording' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Recording deleted successfully' });
  } catch (error) {
    console.error('Failed to delete recording:', error);
    return NextResponse.json({ error: 'Failed to delete recording' }, { status: 500 });
  }
}
