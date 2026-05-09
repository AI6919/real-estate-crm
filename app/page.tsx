"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
export default function Home() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [leads, setLeads] = useState<any[]>([]);
  useEffect(() => {
  fetchLeads();
}, []);

const fetchLeads = async () => {

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  setLeads(data);
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

return (
    <main className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">

        <h1 className="text-2xl font-bold text-blue-600 mb-10">
          RealEstate CRM
        </h1>

        <nav className="space-y-4">

          <div className="p-3 rounded-lg bg-blue-100 text-blue-700 font-semibold">
            Dashboard
          </div>

          <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
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
        <div className="flex justify-between items-center mb-8">

          <h2 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h2>

          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
          
           Add Lead
          </button>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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
              Site Visits
            </h3>

            <p className="text-4xl font-bold mt-4">
              42
            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">

            <h3 className="text-gray-500 text-lg">
              Closed Deals
            </h3>

            <p className="text-4xl font-bold mt-4">
              12
            </p>

          </div>

        </div>

        {/* Add Lead Form */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10 mt-10">

          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            Add New Lead
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

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

          <div className="overflow-x-auto">

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
              

                {leads.map((lead, index) => (
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
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {lead.status}
                      </span>
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
  );
}