import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, mobile, engineModel, city, usageType, additionalNotes } = body;

    // Validation
    if (!fullName || !mobile || !engineModel || !city) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        fullName,
        mobile,
        engineModel,
        city,
        usageType: usageType || 'ترفيهي',
        additionalNotes,
        source: 'website',
        status: 'NEW',
        priority: 'MEDIUM',
      },
    });

    return NextResponse.json({ 
      success: true, 
      leadId: lead.id,
      message: 'Lead created successfully' 
    });

  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
