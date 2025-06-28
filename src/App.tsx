import React from "react";
import { FormWizard } from "./components/FormWizard";

const schema = [
  {
    title: "User Info",
    fields: [
      { name: "email", type: "email", label: "Email", required: true },
      { name: "name", type: "text", label: "Full Name" }
    ]
  },
  {
    title: "Password Setup",
    fields: [
      { name: "password", type: "password", label: "Password", required: true },
      { name: "confirm", type: "password", label: "Confirm Password", required: true }
    ]
  }
];

export default function App() {
  return (
    <div className="p-4">
      <FormWizard schema={schema} onSubmit={(data) => console.log("Submitted:", data)} />
    </div>
  );
}