import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Visitor from '@/models/Visitor';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET admin statistics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'NOT_AUTHENTICATED' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    await connectDB();

    const [totalUsers, totalOrders, totalProducts, orders] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Order.countDocuments(),
      Product.countDocuments(),
      Order.find({}).select('totalPrice createdAt status'),
    ]);

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const processingOrders = orders.filter((o) => o.status === 'processing').length;
    const shippedOrders = orders.filter((o) => o.status === 'shipped').length;
    const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

    // Visitors for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoString = thirtyDaysAgo.toISOString().split("T")[0];

    const visitorsData = await Visitor.aggregate([
      { $match: { date: { $gte: thirtyDaysAgoString } } },
      { $group: { _id: "$date", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const visitors = visitorsData.map(v => ({ date: v._id, count: v.count }));

    // Recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      visitors,
      recentOrders,
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { 
        error: error?.message || 'Failed to fetch statistics',
        code: 'STATS_FETCH_ERROR',
        details: process.env.NODE_ENV === 'development' ? error?.toString() : undefined
      },
      { status: 500 }
    );
  }
}
