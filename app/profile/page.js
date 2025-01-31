"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("");

  const getUserDetails = async () => {
    const res = await axios.post("/api/users/me");
    console.log(res.data.data);
    setData(res.data.data._id);
  };

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("logout success");
      router.push("/login");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h1>profile page</h1>
      <hr />
      <h2>
        {data === "" ? (
          "nothing"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <hr />
      <button onClick={logout}>Logout</button>
      <button onClick={getUserDetails}>Get User Details</button>
    </div>
  );
}
