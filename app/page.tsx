"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
export default function Home() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");
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
  const [statusFilter, setStatusFilter] =
  useState("All");
  const [menuOpen, setMenuOpen] =
  useState(false);

  const [leads, setLeads] = useState<any[]>([]);
  useEffect(() => {

  checkUser();

  fetchLeads();
  
  fetchProperties();

  fetchSiteVisits();

}, []);
useEffect(() => {

  const closed =
    leads.filter(
      (lead) => lead.status === "Closed"
    ).length;

  setClosedDeals(closed);

}, [leads]);

const checkUser = async () => {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  setUser(user);
};
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

  const { error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    alert(error.message);
    return;
  }

  checkUser();
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
const addLead = async () => {

  if (!name || !phone) return;

  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        name,
        phone,
        property: "New Property",
        status: "New",
        user_id: user.id,
      },
    ]);

  if (error) {
    console.log(error);
    return;
  }

  const newLead = {
    name,
    phone,
    property: "New Property",
    status: "New",
  };

  fetchLeads();
  setName("");
  setPhone("");
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
const updateLeadStatus = async (
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
const deleteLead = async (id: number) => {

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    return;
  }

  fetchLeads();
};

const filteredLeads = leads.filter((lead) => {

  const matchesSearch =
    lead.name
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "All" ||
    lead.status === statusFilter;

  return matchesSearch && matchesStatus;
});
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
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-3 rounded-lg mb-6"
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-3 rounded-lg mb-3"
        >
          Login
        </button>

        <button
          onClick={signup}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          Create Account
        </button>

      </div>

    </div>

  ) : (
    <main className="min-h-screen bg-gray-100 flex">

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
  className="p-3 rounded-lg bg-blue-100 text-blue-700 font-semibold"
>
  Dashboard
</div>

          <div
  onClick={() => setMenuOpen(false)}
  className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
>
  Leads
</div>

          <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            Properties
          </div>

          <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            Customers
          </div>

          <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            Site Visits
          </div>

        </nav>

      </aside>

      {/* Main Content */}
      <section className="flex-1 p-8">

        {/* Top Bar */}
        <div className="md:hidden mb-6">

  <button
    onClick={() =>
      setMenuOpen(!menuOpen)
    }
    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
  >
    ☰ Menu
  </button>

</div>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h2>

          <div className="flex gap-3">

  <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
    Add Lead
  </button>

  <button
    onClick={logout}
    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
  >
    Logout
  </button>

</div>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-md">

            <h3 className="text-gray-500 text-lg">
              Total Leads
            </h3>

            <p className="text-4xl font-bold mt-4">
              {leads.length}
            </p>

          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">

  <h3 className="text-gray-500 text-lg">
    Properties
  </h3>

  <p className="text-4xl font-bold mt-4">
    {properties.length}
  </p>

</div>

          <div className="bg-white p-6 rounded-2xl shadow-md">

            <h3 className="text-gray-500 text-lg">
              Site Visits
            </h3>

            <p className="text-4xl font-bold mt-4">
              {siteVisits.length}
            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">

            <h3 className="text-gray-500 text-lg">
              Closed Deals
            </h3>

            <p className="text-4xl font-bold mt-4">
              {closedDeals}
            </p>

          </div>

        </div>

        {/* Add Lead Form */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10 mt-10">

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
  className="border p-3 rounded-lg"
/>

            <input
  id="phoneNumber"
  name="phoneNumber"
  type="text"
  placeholder="Phone Number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  className="border p-3 rounded-lg"
/>

          </div>

          <button
  onClick={addLead}
  className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
>
  Save Lead
</button>

        </div>

        <div className="mb-6">

  <input
    type="text"
    placeholder="Search by name or phone..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full border p-3 rounded-xl"
  />

</div>
        {/* Property Form */}

<div className="bg-white rounded-2xl shadow-md p-6 mt-10">

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
      className="border p-3 rounded-lg"
    />

    <input
      type="text"
      placeholder="Price"
      value={propertyPrice}
      onChange={(e) =>
        setPropertyPrice(e.target.value)
      }
      className="border p-3 rounded-lg"
    />

    <input
      type="text"
      placeholder="Location"
      value={propertyLocation}
      onChange={(e) =>
        setPropertyLocation(e.target.value)
      }
      className="border p-3 rounded-lg"
    />

  </div>

  <button
    onClick={addProperty}
    className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
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
        className="bg-white rounded-2xl shadow-md p-6"
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

<div className="bg-white rounded-2xl shadow-md p-6 mt-10">

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
      className="border p-3 rounded-lg"
    />

    <input
      type="text"
      placeholder="Property Name"
      value={visitProperty}
      onChange={(e) =>
        setVisitProperty(e.target.value)
      }
      className="border p-3 rounded-lg"
    />

    <input
      type="date"
      value={visitDate}
      onChange={(e) =>
        setVisitDate(e.target.value)
      }
      className="border p-3 rounded-lg"
    />

  </div>

  <button
    onClick={addSiteVisit}
    className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
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
        className="bg-white rounded-2xl shadow-md p-6"
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
    className="border p-3 rounded-lg flex-1"
  />

  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(e.target.value)
    }
    className="border p-3 rounded-lg"
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
        <div className="bg-white mt-10 rounded-2xl shadow-md p-6">

          <div className="flex justify-between items-center mb-6">

            <h3 className="text-2xl font-bold text-gray-800">
              Recent Leads
            </h3>

            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Export
            </button>

          </div>

          <div className="overflow-x-auto rounded-xl">

            <table className="w-full border-collapse">

              <thead>
                <tr className="bg-gray-100 text-left">

                  <th className="p-4">Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Property</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>

                </tr>
              </thead>

              <tbody>

  {filteredLeads.map((lead, index) => (

    <tr key={index} className="border-b">

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
          className="border rounded-lg px-3 py-2"
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

      <td className="p-4">

        <button
          onClick={() => deleteLead(lead.id)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Delete
        </button>

      </td>

    </tr>

  ))}

</tbody>

            </table>

          </div>

        </div>

      </section>

    </main>
      )}
</>
  );
}