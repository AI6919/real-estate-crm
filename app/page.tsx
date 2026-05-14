"use client";

import {
  useState,
  useEffect,
} from "react";
import { supabase } from "./lib/supabase";
export default function Home() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
  useState("All");
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [user, setUser] = useState<any>(null);
const [propertyTitle, setPropertyTitle] =
  useState("");

const [propertyPrice, setPropertyPrice] =
  useState("");

const [propertyLocation, setPropertyLocation] =
  useState("");

const [properties, setProperties] =
  useState<any[]>([]);
  const [visitLead, setVisitLead] =
  useState("");

const [visitProperty, setVisitProperty] =
  useState("");

const [visitDate, setVisitDate] =
  useState("");

const [siteVisits, setSiteVisits] =
  useState<any[]>([]);
  const [closedDeals, setClosedDeals] =
  useState(0);
  const [menuOpen, setMenuOpen] =
  useState(false);
  const [darkMode, setDarkMode] =
  useState(false);
  useEffect(() => {

  const savedTheme =
    localStorage.getItem("darkMode");

  if (savedTheme === "true") {
    setDarkMode(true);
  }

}, []);
useEffect(() => {

  const getSession = async () => {

    const {
  data: { session },
  error,
} = await supabase.auth.getSession();

if (error) {

  console.log(error);

  await supabase.auth.signOut();

  setUser(null);

  setLoading(false);

  return;
}

    setUser(session?.user || null);

    setLoading(false);
  };

  getSession();

  const {
    data: authListener,
  } = supabase.auth.onAuthStateChange(
    (_event, session) => {

      setUser(session?.user || null);

      setLoading(false);
    }
  );

  return () => {
    authListener.subscription.unsubscribe();
  };

}, []);
useEffect(() => {

  if (user) {

    fetchLeads();

    fetchProperties();

    fetchSiteVisits();
  }

}, [user]);
useEffect(() => {

  localStorage.setItem(
    "darkMode",
    darkMode.toString()
  );

}, [darkMode]);
useEffect(() => {

  if (user) {
    fetchLeads();
  }

}, [user]);

  const [notes, setNotes] =
  useState("");
  const [followup, setFollowup] =
  useState("");
  const [editingId, setEditingId] =
  useState<number | null>(null);

  const [leads, setLeads] = useState<any[]>([]);
  const today = new Date()
  .toISOString()
  .split("T")[0];
  const overdueLeads =
  leads.filter(
    (lead) =>
      lead.followup &&
      lead.followup < today
  ).length;

const todayLeads =
  leads.filter(
    (lead) =>
      lead.followup === today
  ).length;

const upcomingLeads =
  leads.filter(
    (lead) =>
      lead.followup &&
      lead.followup > today
  ).length;
   
useEffect(() => {

  const closed =
    leads.filter(
      (lead) => lead.status === "Closed"
    ).length;

  setClosedDeals(closed);

}, [leads]);


const fetchLeads = async () => {

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user?.id)
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  setLeads(data);
};

const login = async () => {

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  console.log("LOGIN DATA:", data);
  console.log("LOGIN ERROR:", error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Login Successful");
};
const signup = async () => {

  console.log("Signup started");

  const result =
    await supabase.auth.signUp({
      email,
      password,
    });

  console.log(result);

  const { error } = result;

  if (error) {
    console.log(error);
    alert(error.message);
    return;
  }

  alert("Account created!");
};
const logout = async () => {

  await supabase.auth.signOut();

  setUser(null);
};
const [loading, setLoading] =
  useState(true);
const fetchProperties = async () => {

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("user_id", user?.id)
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  setProperties(data);
};
const fetchSiteVisits = async () => {

  const { data, error } = await supabase
    .from("site_visits")
    .select("*")
    .eq("user_id", user?.id)
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  setSiteVisits(data);
};
const editLead = (lead: any) => {

  setEditingId(lead.id);

  setName(lead.name);

  setPhone(lead.phone);

  setNotes(lead.notes || "");

  setFollowup(lead.followup || "");

};

const addLead = async () => {

  if (!name || !phone) return;

  let error;

if (editingId) {

  const response = await supabase
    .from("leads")
    .update({
      name,
      phone,
      notes,
      followup,
    })
    .eq("id", editingId);

  error = response.error;

} else {

  const response = await supabase
    .from("leads")
    .insert([
      {
        name,
        phone,
        property: "New Property",
        status: "New",
        notes,
        followup,
        user_id: user.id,
      },
    ]);

  error = response.error;
}

  if (error) {
    console.log(error);
    return;
  }

  

  fetchLeads();

setName("");
setPhone("");
setNotes("");
setFollowup("");
setEditingId(null);
};

  


const updateStatus = async (
  id: number,
  status: string
) => {

  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.log(error);
    return;
  }

  fetchLeads();
};
const addProperty = async () => {

  const { error } = await supabase
    .from("properties")
    .insert([
      {
        title: propertyTitle,
        price: propertyPrice,
        location: propertyLocation,
        status: "Available",
        user_id: user.id,
      },
    ]);

  if (error) {
    console.log(error);
    return;
  }

  fetchProperties();

  setPropertyTitle("");
  setPropertyPrice("");
  setPropertyLocation("");
};
const addSiteVisit = async () => {

  const { error } = await supabase
    .from("site_visits")
    .insert([
      {
        lead_name: visitLead,
        property_name: visitProperty,
        visit_date: visitDate,
        status: "Scheduled",
        user_id: user.id,
      },
    ]);

  if (error) {
    console.log(error);
    return;
  }

  fetchSiteVisits();

  setVisitLead("");
  setVisitProperty("");
  setVisitDate("");
};

const deleteLead = async (id: number) => {

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    console.log(error);
    return;
  }

  setLeads((prev) =>
    prev.filter((lead) => lead.id !== id)
  );
};

const filteredLeads = leads.filter(
  (lead) => {

    const matchesSearch =
      lead.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      lead.phone
        ?.toString()
        .includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      lead.status === statusFilter;

    return (
      matchesSearch &&
      matchesStatus
    );
  }
);

const importantFollowups =
  leads.filter(
    (lead) =>
      lead.followup &&
      lead.followup.trim() !== ""
  );

const exportLeads = () => {

  const headers = [
    "Name",
    "Phone",
    "Property",
    "Status",
  ];

  const rows = leads.map((lead) => [
    lead.name,
    lead.phone,
    lead.property,
    lead.status,
  ]);

  const csvContent =
    [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

  const blob = new Blob(
    [csvContent],
    { type: "text/csv;charset=utf-8;" }
  );

  const link =
    document.createElement("a");

  const url =
    URL.createObjectURL(blob);

  link.setAttribute("href", url);

  link.setAttribute(
    "download",
    "leads.csv"
  );

  link.style.visibility = "hidden";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};
if (loading) {

  return (

    <div className="min-h-screen flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-3xl font-bold">
          Loading CRM...
        </h1>

        <p className="text-gray-500 mt-2">
          Please wait
        </p>

      </div>

    </div>
  );
}
return (
  <>
  {!user ? (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold mb-6 text-center">
          CRM Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-3 rounded-2xl mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-3 rounded-2xl mb-6"
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-3 rounded-2xl mb-3"
        >
          Login
        </button>

        <button
          onClick={signup}
          className="w-full bg-green-600 text-white py-3 rounded-2xl"
        >
          Create Account
        </button>

      </div>

    </div>

  ) : (
    <main
  className={`min-h-screen flex ${
    darkMode
      ? "bg-gray-900 text-white"
      : "bg-gray-100 text-black"
  }`}
>

      {menuOpen && (
  <div
    onClick={() => setMenuOpen(false)}
    className="fixed inset-0 bg-black/40 z-40 md:hidden"
  />
)}
      {/* Sidebar */}
      <aside
  className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-white shadow-lg p-6 transform transition-transform duration-300 ${
    menuOpen
      ? "translate-x-0"
      : "-translate-x-full md:translate-x-0"
  }`}
>

        <h1 className="text-2xl font-bold text-blue-600 mb-10">
          RealEstate CRM
        </h1>

        <nav className="space-y-4">

          <div
  onClick={() => setMenuOpen(false)}
  className="p-3 rounded-2xl bg-blue-100 text-blue-700 font-semibold"
>
  Dashboard
</div>

          <div
  onClick={() => setMenuOpen(false)}
  className="p-3 rounded-2xl hover:bg-gray-100 cursor-pointer"
>
  Leads
</div>

          <div className="p-3 rounded-2xl hover:bg-gray-100 cursor-pointer">
            Properties
          </div>

          <div className="p-3 rounded-2xl hover:bg-gray-100 cursor-pointer">
            Customers
          </div>

          <div className="p-3 rounded-2xl hover:bg-gray-100 cursor-pointer">
            Site Visits
          </div>

        </nav>

      </aside>

      {/* Main Content */}
      <section className="flex-1 px-4 md:px-8 py-6">

        {/* Top Bar */}
        <div className="md:hidden mb-6 sticky top-0 z-30 backdrop-blur-md bg-white/80 p-4 rounded-2xl shadow-lg">

  <button
    onClick={() =>
      setMenuOpen(!menuOpen)
    }
   className="bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-lg text-lg font-semibold"
  >
    ☰ Menu
  </button>

</div>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h2>

          <div className="flex gap-3">

  <button className="bg-blue-600 text-white px-5 py-2 rounded-2xl hover:bg-blue-700">
    Add Lead
  </button>

  <button
    onClick={logout}
    className="bg-red-500 text-white px-5 py-2 rounded-2xl hover:bg-red-600"
  >
    Logout
  </button>

</div>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <h3 className="text-gray-500 text-lg">
              Total Leads
            </h3>

            <p className="text-4xl font-bold mt-4">
              {leads.length}
            </p>

          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">

  <h3 className="text-gray-500 text-lg">
    Properties
  </h3>

  <p className="text-4xl font-bold mt-4">
    {properties.length}
  </p>

</div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">

            <h3 className="text-gray-500 text-lg">
              Site Visits
            </h3>

            <p className="text-4xl font-bold mt-4">
              {siteVisits.length}
            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">

            <h3 className="text-gray-500 text-lg">
              Closed Deals
            </h3>

            <p className="text-4xl font-bold mt-4">
              {closedDeals}
            </p>

          </div>

        </div>

        {/* Follow-Up Dashboard */}

<div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-10">

  <h3 className="text-2xl font-bold mb-6 text-yellow-800">
    Follow-Up Reminders
  </h3>

  <div className="space-y-4">

    {importantFollowups.length === 0 ? (

      <p className="text-gray-500">
        No follow-ups yet
      </p>

    ) : (

      importantFollowups.map((lead, index) => (

        <div
          key={index}
          className={`rounded-xl p-4 shadow-sm ${
  lead.followup < today
    ? "bg-red-100 border border-red-300"
    : lead.followup === today
    ? "bg-yellow-100 border border-yellow-300"
    : "bg-white"
}`}
        >

          <h4 className="font-bold text-lg">
            {lead.name}
          </h4>

          <p className="text-gray-600">
            📞 {lead.phone}
          </p>

          <p className="text-yellow-700 mt-2">
            ⏰ {lead.followup}
          </p>

        </div>

      ))

    )}

  </div>

</div>
        {/* Add Lead Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 mt-10">

          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            Add New Lead
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
  id="customerName"
  name="customerName"
  type="text"
  placeholder="Customer Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="border p-3 rounded-2xl"
/>

            <input
  id="phoneNumber"
  name="phoneNumber"
  type="text"
  placeholder="Phone Number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  className="border p-3 rounded-2xl"
/>
<textarea
  placeholder="Lead Notes"
  value={notes}
  onChange={(e) =>
    setNotes(e.target.value)
  }
  className="border p-3 rounded-2xl md:col-span-2"
/>
<input
  type="date"
  placeholder="Follow-up Reminder"
  value={followup}
  onChange={(e) =>
    setFollowup(e.target.value)
  }
  className="border p-3 rounded-2xl md:col-span-2"
/>

          </div>

          <button
  onClick={addLead}
  className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700"
>
  Save Lead
</button>

        </div>

        
        {/* Property Form */}

<div className="bg-white rounded-2xl shadow-lg p-6 mt-10">

  <h3 className="text-2xl font-bold mb-6 text-gray-800">
    Add Property
  </h3>

  <div className="grid md:grid-cols-3 gap-4">

    <input
      type="text"
      placeholder="Property Title"
      value={propertyTitle}
      onChange={(e) =>
        setPropertyTitle(e.target.value)
      }
      className="border p-3 rounded-2xl"
    />

    <input
      type="text"
      placeholder="Price"
      value={propertyPrice}
      onChange={(e) =>
        setPropertyPrice(e.target.value)
      }
      className="border p-3 rounded-2xl"
    />

    <input
      type="text"
      placeholder="Location"
      value={propertyLocation}
      onChange={(e) =>
        setPropertyLocation(e.target.value)
      }
      className="border p-3 rounded-2xl"
    />

  </div>

  <button
    onClick={addProperty}
    className="mt-6 bg-green-600 text-white px-6 py-3 rounded-2xl hover:bg-green-700"
  >
    Save Property
  </button>

</div>
        {/* Properties List */}

<div className="mt-10">

  <h3 className="text-2xl font-bold mb-6 text-gray-800">
    Properties
  </h3>

  <div className="grid md:grid-cols-3 gap-6">

    {properties.map((property, index) => (

      <div
        key={index}
        className="bg-white rounded-2xl shadow-lg p-6"
      >

        <h4 className="text-xl font-bold mb-3">
          {property.title}
        </h4>

        <p className="text-gray-600 mb-2">
          💰 {property.price}
        </p>

        <p className="text-gray-600 mb-4">
          📍 {property.location}
        </p>

        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
          {property.status}
        </span>

      </div>

    ))}

  </div>

</div>
        {/* Site Visit Scheduler */}

<div className="bg-white rounded-2xl shadow-lg p-6 mt-10">

  <h3 className="text-2xl font-bold mb-6 text-gray-800">
    Schedule Site Visit
  </h3>

  <div className="grid md:grid-cols-3 gap-4">

    <input
      type="text"
      placeholder="Lead Name"
      value={visitLead}
      onChange={(e) =>
        setVisitLead(e.target.value)
      }
      className="border p-3 rounded-2xl"
    />

    <input
      type="text"
      placeholder="Property Name"
      value={visitProperty}
      onChange={(e) =>
        setVisitProperty(e.target.value)
      }
      className="border p-3 rounded-2xl"
    />

    <input
      type="date"
      value={visitDate}
      onChange={(e) =>
        setVisitDate(e.target.value)
      }
      className="border p-3 rounded-2xl"
    />

  </div>

  <button
    onClick={addSiteVisit}
    className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-2xl hover:bg-purple-700"
  >
    Schedule Visit
  </button>

</div>
        {/* Site Visits List */}

<div className="mt-10">

  <h3 className="text-2xl font-bold mb-6 text-gray-800">
    Scheduled Visits
  </h3>

  <div className="grid md:grid-cols-2 gap-6">

    {siteVisits.map((visit, index) => (

      <div
        key={index}
        className="bg-white rounded-2xl shadow-lg p-6"
      >

        <h4 className="text-xl font-bold mb-3">
          {visit.lead_name}
        </h4>

        <p className="text-gray-600 mb-2">
          🏠 {visit.property_name}
        </p>

        <p className="text-gray-600 mb-4">
          📅 {visit.visit_date}
        </p>

        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
          {visit.status}
        </span>

      </div>

    ))}

  </div>

</div>
        <div className="flex flex-col md:flex-row gap-4 mt-10">

  <input
    type="text"
    placeholder="Search Leads..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="border p-3 rounded-2xl flex-1"
  />

  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(e.target.value)
    }
    className="border p-3 rounded-2xl"
  >

    <option value="All">
      All Status
    </option>

    <option value="New">
      New
    </option>

    <option value="Interested">
      Interested
    </option>

    <option value="Site Visit">
      Site Visit
    </option>

    <option value="Negotiation">
      Negotiation
    </option>

    <option value="Closed">
      Closed
    </option>

  </select>

</div>
        {/* Leads Table */}
        <div className="bg-white mt-10 rounded-2xl shadow-lg p-6">

          <div className="flex justify-between items-center mb-6">

            <h3 className="text-2xl font-bold text-gray-800">
              Recent Leads
            </h3>

            <button
  onClick={exportLeads}
  className="bg-green-600 text-white px-5 py-3 rounded-2xl hover:bg-green-700"
>
  Export
</button>
<button
  onClick={() =>
    setDarkMode(!darkMode)
  }
  className="bg-gray-800 text-white px-5 py-3 rounded-2xl"
>
  {darkMode ? "☀️ Light" : "🌙 Dark"}
</button>

          </div>

          <div className="hidden md:block overflow-x-auto rounded-3xl">

            <table className="min-w-[900px] w-full border-collapse">

              <thead>
                <tr className="bg-gray-100 text-left">

                  <th className="p-4">Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Property</th>
                  <th className="p-4">Status</th>
<th className="p-4">Notes</th>
<th className="p-4">Action</th>




                </tr>
              </thead>

              <tbody>

  {filteredLeads.map((lead, index) => (

    <tr key={lead.id} className="border-b">

      <td className="p-4">
        {lead.name}
      </td>

      <td className="p-4">
        {lead.phone}
      </td>

      <td className="p-4">
        {lead.property}
      </td>

      

       <td className="p-4">
       <select
          value={lead.status}
          onChange={(e) =>
            updateStatus(
              lead.id,
              e.target.value
            )
          }
          className="border rounded-2xl px-3 py-2"
        >

          <option value="New">New</option>

          <option value="Interested">
            Interested
          </option>

          <option value="Site Visit">
            Site Visit
          </option>

          <option value="Negotiation">
            Negotiation
          </option>

          <option value="Closed">
            Closed
          </option>

        </select>
        

      </td>
      <td className="p-4 max-w-xs">

  <p className="truncate">
    {lead.notes || "No Notes"}
  </p>

</td>

      <td className="p-4">

        <button
  onClick={() => editLead(lead)}
  className="bg-blue-500 text-white px-5 py-3 rounded-2xl hover:bg-blue-600 mr-2"
>
  Edit
</button>
        <button
          onClick={() => deleteLead(lead.id)}
          className="bg-red-500 text-white px-5 py-3 rounded-2xl hover:bg-red-600"
        >
          Delete
        </button>

      </td>

    </tr>

  ))}

</tbody>

            </table>

</div>

<div className="md:hidden space-y-4 mt-4">

  {filteredLeads.map((lead, index) => (

    <div
      key={index}
      className="bg-white rounded-2xl shadow p-4 border"
    >

      <div className="flex justify-between items-start">

        <div>
          <h3 className="text-lg font-bold">
            {lead.name}
          </h3>

          <p className="text-gray-500 text-sm">
            {lead.phone}
          </p>
        </div>

        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          {lead.status}
        </span>

      </div>

      <div className="mt-4 space-y-2">

        <p>
          <span className="font-semibold">
            Property:
          </span>{" "}
          {lead.property}
        </p>

        <p>
          <span className="font-semibold">
            Follow-up:
          </span>{" "}
          {lead.followup || "No Date"}
        </p>

        <p className="text-sm text-gray-600">
          {lead.notes || "No Notes"}
        </p>

      </div>

      <div className="flex gap-2 mt-4">

        <button
          onClick={() => editLead(lead)}
          className="flex-1 bg-blue-500 text-white py-2 rounded-xl"
        >
          Edit
        </button>

        <button
          onClick={() => deleteLead(lead.id)}
          className="flex-1 bg-red-500 text-white py-2 rounded-xl"
        >
          Delete
        </button>

      </div>

    </div>

        ))}

</div>

</div>

        

      </section>

    </main>
      )}
</>
  );
}
