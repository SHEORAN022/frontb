
import React, { useState } from "react";

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  page: {
    background: "#f4f6f9",
    minHeight: "100vh",
    padding: "2rem 1rem",
    fontFamily: "'Segoe UI', sans-serif",
  },
  wrap: { maxWidth: "680px", margin: "0 auto" },
  topHeader: { textAlign: "center", marginBottom: "2rem" },
  topTitle: { fontSize: "24px", fontWeight: "600", color: "#1a1a2e", marginBottom: "4px" },
  topSub: { fontSize: "13px", color: "#6b7280" },
  stepsRow: { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem" },
  stepWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" },
  stepNum: (active) => ({
    width: "28px", height: "28px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: "500",
    background: active ? "#534AB7" : "#e5e7eb",
    color: active ? "#fff" : "#9ca3af",
  }),
  stepLabel: (active) => ({ fontSize: "11px", color: active ? "#534AB7" : "#9ca3af", fontWeight: active ? "500" : "400" }),
  connector: { width: "48px", height: "1px", background: "#e5e7eb", marginBottom: "18px" },
  card: { background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "1.25rem", marginBottom: "1rem" },
  secHead: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem", paddingBottom: "10px", borderBottom: "1px solid #f3f4f6" },
  secIcon: (bg) => ({ width: "30px", height: "30px", borderRadius: "8px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }),
  secTitle: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" },
  field: { display: "flex", flexDirection: "column", gap: "5px", marginBottom: "12px" },
  fieldNoMargin: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "12px", color: "#6b7280", fontWeight: "500" },
  req: { color: "#ef4444" },
  input: {
    background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px",
    padding: "9px 12px", fontSize: "14px", color: "#111827",
    outline: "none", width: "100%", fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  textarea: {
    background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px",
    padding: "9px 12px", fontSize: "14px", color: "#111827",
    outline: "none", width: "100%", fontFamily: "inherit",
    resize: "vertical", minHeight: "76px", transition: "border-color 0.15s",
  },
  select: {
    background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px",
    padding: "9px 12px", fontSize: "14px", color: "#111827",
    outline: "none", width: "100%", fontFamily: "inherit", appearance: "none",
  },
  dueRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0 0 0", borderTop: "1px solid #f3f4f6", marginTop: "12px" },
  dueLabel: { fontSize: "12px", color: "#6b7280" },
  dueVal: { fontSize: "14px", fontWeight: "600", color: "#111827" },
  successBanner: {
    background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px",
    padding: "12px 16px", color: "#166534", fontSize: "13px",
    fontWeight: "500", textAlign: "center", marginBottom: "1rem",
  },
  submitBtn: {
    width: "100%", padding: "12px", background: "#534AB7", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600",
    cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.01em",
    marginTop: "0.5rem", transition: "background 0.15s",
  },
  submitBtnDisabled: {
    width: "100%", padding: "12px", background: "#9ca3af", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600",
    cursor: "not-allowed", fontFamily: "inherit",
  },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const StepIndicator = ({ steps }) => (
  <div style={styles.stepsRow}>
    {steps.map((step, i) => (
      <React.Fragment key={step.label}>
        <div style={styles.stepWrap}>
          <div style={styles.stepNum(step.active)}>{step.done ? "✓" : i + 1}</div>
          <span style={styles.stepLabel(step.active)}>{step.label}</span>
        </div>
        {i < steps.length - 1 && <div style={styles.connector} />}
      </React.Fragment>
    ))}
  </div>
);

const SectionCard = ({ iconBg, iconChar, title, children }) => (
  <div style={styles.card}>
    <div style={styles.secHead}>
      <div style={styles.secIcon(iconBg)}>
        <span style={{ fontSize: "14px" }}>{iconChar}</span>
      </div>
      <span style={styles.secTitle}>{title}</span>
    </div>
    {children}
  </div>
);

const Field = ({ label, required, noMargin, children }) => (
  <div style={noMargin ? styles.fieldNoMargin : styles.field}>
    <label style={styles.label}>
      {label} {required && <span style={styles.req}>*</span>}
    </label>
    {children}
  </div>
);

// ─── Constants ─────────────────────────────────────────────────────────────────

const INITIAL_FORM = {
  name: "", fatherName: "", motherName: "", address: "",
  mobile: "", course: "", collegeName: "", rollNumber: "",
  semester: "", payment: "", token: "", fullPayment: "",
};

// ─── Validation ────────────────────────────────────────────────────────────────

const validate = (form) => {
  const requiredFields = [
    "name", "fatherName", "motherName", "address",
    "mobile", "course", "collegeName", "rollNumber", "semester",
  ];
  for (const key of requiredFields) {
    if (!form[key].trim()) {
      const label = key.replace(/([A-Z])/g, " $1").toLowerCase();
      return `Please fill in: ${label}`;
    }
  }
  if (!/^\d{10}$/.test(form.mobile)) return "Enter a valid 10-digit mobile number.";
  if (!form.payment || Number(form.payment) <= 0) return "Please enter a valid total payment amount.";
  if (form.token && Number(form.token) > Number(form.payment)) return "Token amount cannot exceed total payment.";
  return null;
};

// ─── Load Cashfree SDK ─────────────────────────────────────────────────────────

const loadCashfreeSDK = () =>
  new Promise((resolve) => {
    // If already loaded
    if (window.Cashfree) return resolve(true);

    const script = document.createElement("script");
    // Use sandbox SDK for TEST mode, production SDK for PROD mode
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ─── Main Component ────────────────────────────────────────────────────────────

const EnrollmentForm = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (success) setSuccess("");
  };

  const dueAmount = () => {
    const total = parseFloat(form.payment) || 0;
    const paid = (parseFloat(form.token) || 0) + (parseFloat(form.fullPayment) || 0);
    return total > 0 ? `₹ ${Math.max(0, total - paid).toLocaleString("en-IN")}` : "₹ —";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1 — Frontend validation
    const error = validate(form);
    if (error) { alert(error); return; }

    try {
      setLoading(true);
      setSuccess("");

      // Step 2 — Load Cashfree SDK
      const sdkLoaded = await loadCashfreeSDK();
      if (!sdkLoaded) {
        alert("Failed to load Cashfree. Check your internet connection.");
        setLoading(false);
        return;
      }

      // Step 3 — Create Cashfree order from backend
      const orderRes = await fetch("https://bee-peach.vercel.app/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: form.payment,
          customer: {
            phone: form.mobile,
            email: "", // Optional: add email field to form if needed
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || "Order creation failed");
      }

      // const { payment_session_id, order_id } = orderData;

      const { payment_session_id, order_id } = orderData.data;

      
      // const cashfree = window.Cashfree({ mode: "sandbox" });

      const cashfree = window.Cashfree({ mode: "production" });

      const checkoutOptions = {
        paymentSessionId: payment_session_id,
        redirectTarget: "_modal", // Opens as popup inside page
      };

      // Step 5 — Open Cashfree Checkout
      const result = await cashfree.checkout(checkoutOptions);

      // Step 6 — Handle result
      if (result.error) {
        // Payment failed or was cancelled
        setLoading(false);
        alert(`Payment failed: ${result.error.message || "Please try again."}`);
        return;
      }

      if (result.paymentDetails) {
        // Payment completed — verify on backend
        const verifyRes = await fetch("https://bee-peach.vercel.app/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id,
            formData: form,
          }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || !verifyData.success) {
          throw new Error(verifyData.message || "Verification failed");
        }

        // Step 7 — Show success
        setSuccess(`Payment successful! Enrollment for ${form.name} is confirmed.`);
        setForm(INITIAL_FORM);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

    } catch (err) {
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Personal", active: true,  done: true  },
    { label: "Course",   active: true,  done: false },
    { label: "College",  active: true,  done: false },
    { label: "Payment",  active: false, done: false },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>

        <div style={styles.topHeader}>
          <h1 style={styles.topTitle}>Enrollment Form</h1>
          <p style={styles.topSub}>Complete all sections to register your enrollment</p>
        </div>

        <StepIndicator steps={steps} />

        {success && <div style={styles.successBanner}>{success}</div>}

        <form onSubmit={handleSubmit} noValidate>

          {/* Personal Details */}
          <SectionCard iconBg="#EEEDFE" iconChar="👤" title="Personal details">
            <div style={styles.grid2}>
              <Field label="Full name" required>
                <input style={styles.input} name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
              </Field>
              <Field label="Mobile number" required>
                <input style={styles.input} name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit number" maxLength={10} />
              </Field>
            </div>
            <div style={{ ...styles.grid2, marginTop: "12px" }}>
              <Field label="Father's name" required>
                <input style={styles.input} name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father's full name" />
              </Field>
              <Field label="Mother's name" required>
                <input style={styles.input} name="motherName" value={form.motherName} onChange={handleChange} placeholder="Mother's full name" />
              </Field>
            </div>
            <Field label="Address" required noMargin>
              <textarea style={styles.textarea} name="address" value={form.address} onChange={handleChange} placeholder="Street, city, state, PIN code" />
            </Field>
          </SectionCard>

          {/* Course Details */}
          <SectionCard iconBg="#E1F5EE" iconChar="📚" title="Course details">
            <Field label="Course type" required noMargin>
              <select style={styles.select} name="course" value={form.course} onChange={handleChange}>
                <option value="">Select a course</option>
                <option value="Industrial Training">Industrial Training</option>
                <option value="Internship">Internship</option>
              </select>
            </Field>
          </SectionCard>

          {/* College Details */}
          <SectionCard iconBg="#E6F1FB" iconChar="🏫" title="College details">
            <div style={styles.grid2}>
              <Field label="College name" required>
                <input style={styles.input} name="collegeName" value={form.collegeName} onChange={handleChange} placeholder="College / university name" />
              </Field>
              <Field label="Roll number" required>
                <input style={styles.input} name="rollNumber" value={form.rollNumber} onChange={handleChange} placeholder="Your roll number" />
              </Field>
            </div>
            <Field label="Semester" required noMargin>
              <input style={styles.input} name="semester" value={form.semester} onChange={handleChange} placeholder="e.g. 5th Semester" />
            </Field>
          </SectionCard>

          {/* Payment Details */}
          <SectionCard iconBg="#FAEEDA" iconChar="💳" title="Payment details">
            <div style={styles.grid3}>
              <Field label="Total payment (₹)" noMargin>
                <input style={styles.input} type="number" name="payment" value={form.payment} onChange={handleChange} placeholder="0" min="0" />
              </Field>
              <Field label="Token amount (₹)" noMargin>
                <input style={styles.input} type="number" name="token" value={form.token} onChange={handleChange} placeholder="0" min="0" />
              </Field>
              <Field label="Full payment (₹)" noMargin>
                <input style={styles.input} type="number" name="fullPayment" value={form.fullPayment} onChange={handleChange} placeholder="0" min="0" />
              </Field>
            </div>
            <div style={styles.dueRow}>
              <span style={styles.dueLabel}>Remaining due</span>
              <span style={styles.dueVal}>{dueAmount()}</span>
            </div>
          </SectionCard>

          {/* Submit */}
          <button
            type="submit"
            style={loading ? styles.submitBtnDisabled : styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Opening payment..." : "Pay & Submit Enrollment"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EnrollmentForm;