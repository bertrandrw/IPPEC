import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/common/ToastContainer';
import { ordersAPI } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ORDER_STATUSES = [
	'PENDING',
	'PROCESSING',
	'READY_FOR_PICKUP',
	'IN_TRANSIT',
	'DELIVERED',
	'COMPLETED',
	'CANCELLED',
	'CONFIRMED',
];

const statusColors: Record<string, string> = {
	PENDING: 'bg-[#E1F5FE] text-[#0288D1]',
	PROCESSING: 'bg-[#B3E5FC] text-[#0288D1]',
	READY_FOR_PICKUP: 'bg-[#B3E5FC] text-[#0288D1]',
	IN_TRANSIT: 'bg-[#B3E5FC] text-[#0288D1]',
	DELIVERED: 'bg-[#E8F5E9] text-[#4CAF50]',
	COMPLETED: 'bg-[#E8F5E9] text-[#4CAF50]',
	CANCELLED: 'bg-[#FFEBEE] text-[#D32F2F]',
	CONFIRMED: 'bg-[#E1F5FE] text-[#0288D1]',
};

const OrderDetails: React.FC = () => {
	const [showPrescription, setShowPrescription] = useState(false);
	const [order, setOrder] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState('');
	const [updating, setUpdating] = useState(false);
	const { showToast } = useToast();

	// Get orderId from URL (assume /pharmacist/orders/:orderId)
	const orderId = window.location.pathname.split('/').pop();

	useEffect(() => {
		const fetchOrder = async () => {
			setLoading(true);
			try {
				const res = await ordersAPI.getPharmacyOrderDetails(orderId!);
				setOrder(res.data);
				setStatus(res.data.status);
			} catch (err) {
				showToast('error', 'Failed to fetch order details');
			}
			setLoading(false);
		};
		fetchOrder();
	}, [orderId, showToast]);

	const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newStatus = e.target.value;
		setStatus(newStatus);
		setUpdating(true);
		try {
			const res = await ordersAPI.updateOrderStatus(orderId!, newStatus);
			setOrder((prev: any) => ({ ...prev, status: res.data.status, updatedAt: res.data.updatedAt }));
			showToast('success', `Order status updated to ${newStatus}`);
		} catch (err) {
			showToast('error', 'Failed to update order status');
		}
		setUpdating(false);
	};

	if (loading) return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
	if (!order) return <div className="text-center text-red-500">Order not found.</div>;

		return (
			<div className="max-w-4xl mx-auto py-8 px-2">
				<Card title={`Order #${order.id}`} className="mb-6 shadow-lg">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<div className={`inline-block px-3 py-1 rounded-lg font-semibold text-sm mb-2 ${statusColors[order.status]}`}>{order.status.replace(/_/g, ' ')}</div>
							<div className="text-xs text-slate-500">Created: {new Date(order.createdAt).toLocaleString()}</div>
							<div className="text-xs text-slate-500">Updated: {new Date(order.updatedAt).toLocaleString()}</div>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Update Status</label>
							<select
								className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0288D1] bg-[#E1F5FE] text-[#0288D1]"
								value={status}
								onChange={handleStatusChange}
								disabled={updating}
							>
								{ORDER_STATUSES.map(s => (
									<option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
								))}
							</select>
						</div>
					</div>
				</Card>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Card title="Patient Info" className="shadow">
						<div className="space-y-1">
							<div className="font-semibold text-[#0288D1]">{order.patient.fullName}</div>
							<div className="text-sm">Sex: {order.patient.sex}</div>
							<div className="text-sm">DOB: {new Date(order.patient.dateOfBirth).toLocaleDateString()}</div>
							<div className="text-sm">NID: {order.patient.nid}</div>
							{order.patient.insurancePolicyNumber && <div className="text-sm">Insurance: {order.patient.insurancePolicyNumber}</div>}
						</div>
					</Card>

					<Card title="Doctor & Prescription Info" className="shadow">
						<div className="space-y-1">
							<div className="font-semibold text-[#0288D1]">Doctor: {order.prescription?.doctor?.fullName}</div>
							<div className="text-sm">Specialty: {order.prescription?.doctor?.specialty}</div>
							<div className="text-sm">Hospital: {order.prescription?.doctor?.hospital?.name}</div>
							<div className="text-sm">Created: {new Date(order.prescription?.createdAt).toLocaleDateString()}</div>
						</div>
					</Card>
				</div>

						{/* Dedicated Patient Prescription Section with button */}
						<Card title="Patient Prescription" className="mt-6 shadow border-[#0288D1]">
							{order.orderItems.length > 0 && (
								<>
									<Button
										variant="secondary"
										className="mb-4"
										onClick={() => setShowPrescription(true)}
									>
										View Full Prescription
									</Button>
									<div className="space-y-2">
										<div className="font-semibold text-[#0288D1]">Chief Complaints:</div>
										<div className="bg-[#E1F5FE] rounded-lg p-2 text-slate-800">{order.orderItems[0].prescription.chiefComplaints}</div>
										<div className="font-semibold text-[#0288D1]">Findings on Exam:</div>
										<div className="bg-[#E1F5FE] rounded-lg p-2 text-slate-800">{order.orderItems[0].prescription.findingsOnExam}</div>
										<div className="font-semibold text-[#0288D1]">Advice:</div>
										<div className="bg-[#E1F5FE] rounded-lg p-2 text-slate-800">{order.orderItems[0].prescription.advice}</div>
										<div className="font-semibold text-[#0288D1]">Follow Up Date:</div>
										<div className="bg-[#E1F5FE] rounded-lg p-2 text-slate-800">{new Date(order.orderItems[0].prescription.followUpDate).toLocaleDateString()}</div>
										{order.orderItems[0].prescription.investigations && (
											<>
												<div className="font-semibold text-[#0288D1]">Investigations:</div>
												<div className="bg-[#E1F5FE] rounded-lg p-2 text-slate-800">{order.orderItems[0].prescription.investigations}</div>
											</>
										)}
									</div>
								</>
							)}
						</Card>

						{/* Modal for full prescription details */}
						{showPrescription && order.orderItems.length > 0 && (
							<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
								<div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border-2 border-[#0288D1] relative">
									<button
										className="absolute top-2 right-2 text-[#0288D1] hover:text-[#01579B] text-xl font-bold"
										onClick={() => setShowPrescription(false)}
										aria-label="Close"
									>
										&times;
									</button>
									<h2 className="text-xl font-bold mb-4 text-[#0288D1]">Full Prescription Details</h2>
									<div className="space-y-2">
										<div><span className="font-semibold text-[#0288D1]">Prescription ID:</span> {order.orderItems[0].prescription.id}</div>
										<div><span className="font-semibold text-[#0288D1]">Created At:</span> {new Date(order.orderItems[0].prescription.createdAt).toLocaleString()}</div>
										<div><span className="font-semibold text-[#0288D1]">Patient ID:</span> {order.orderItems[0].prescription.patientId}</div>
										<div><span className="font-semibold text-[#0288D1]">Doctor ID:</span> {order.orderItems[0].prescription.doctorId}</div>
										<div><span className="font-semibold text-[#0288D1]">Hospital ID:</span> {order.orderItems[0].prescription.hospitalId}</div>
										<div><span className="font-semibold text-[#0288D1]">Chief Complaints:</span> {order.orderItems[0].prescription.chiefComplaints}</div>
										<div><span className="font-semibold text-[#0288D1]">Findings on Exam:</span> {order.orderItems[0].prescription.findingsOnExam}</div>
										<div><span className="font-semibold text-[#0288D1]">Advice:</span> {order.orderItems[0].prescription.advice}</div>
										<div><span className="font-semibold text-[#0288D1]">Follow Up Date:</span> {new Date(order.orderItems[0].prescription.followUpDate).toLocaleDateString()}</div>
										<div><span className="font-semibold text-[#0288D1]">Status:</span> {order.orderItems[0].prescription.status}</div>
										<div><span className="font-semibold text-[#0288D1]">Dispensed By ID:</span> {order.orderItems[0].prescription.dispensedById || 'N/A'}</div>
										<div><span className="font-semibold text-[#0288D1]">Dispensed At:</span> {order.orderItems[0].prescription.dispensedAt ? new Date(order.orderItems[0].prescription.dispensedAt).toLocaleString() : 'N/A'}</div>
										{order.orderItems[0].prescription.investigations && (
											<div><span className="font-semibold text-[#0288D1]">Investigations:</span> {order.orderItems[0].prescription.investigations}</div>
										)}
										<div className="font-semibold text-[#0288D1] mt-2">Doctor Info:</div>
										<div className="ml-2">
											<div><span className="font-semibold">Full Name:</span> {order.orderItems[0].prescription.doctor.fullName}</div>
											<div><span className="font-semibold">Specialty:</span> {order.orderItems[0].prescription.doctor.specialty}</div>
											<div><span className="font-semibold">Credentials:</span> {order.orderItems[0].prescription.doctor.credentials}</div>
											<div><span className="font-semibold">Hospital:</span> {order.orderItems[0].prescription.doctor.hospital.name}</div>
										</div>
									</div>
								</div>
							</div>
						)}

				<Card title="Order Items" className="mt-6 shadow">
					<div className="divide-y">
						{order.orderItems.map((item: any) => (
							<div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div>
									<div className="font-semibold text-[#0288D1]">{item.medicine.brandName} ({item.medicine.genericName})</div>
									<div className="text-sm">Manufacturer: {item.medicine.manufacturer}</div>
									<div className="text-sm">Price: UGX {item.medicine.price}</div>
									<div className="text-sm">Quantity: {item.quantity}</div>
								</div>
								<div>
									<div className="text-xs text-slate-500">Prescription ID: {item.prescriptionId}</div>
									<div className="text-xs text-slate-500">Chief Complaints: {item.prescription.chiefComplaints}</div>
									<div className="text-xs text-slate-500">Advice: {item.prescription.advice}</div>
									<div className="text-xs text-slate-500">Follow Up: {new Date(item.prescription.followUpDate).toLocaleDateString()}</div>
								</div>
							</div>
						))}
					</div>
				</Card>
			</div>
		);
};

export default OrderDetails;
