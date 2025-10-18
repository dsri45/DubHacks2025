import React from 'react';
import type { User } from "./Users.d.ts";

type Props = { data: User[] };

const table = ({ data }: Props) => {
  return <table>
    <tbody>
        <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Skills</th>
            <th>Location</th>
            <th>Mode</th>

        </tr>
        <tr>
            {data.map((item) => (
                <tr key={item.id}>
                    <td>{item.profileImage}</td>
                    <td>{item.name}</td>
                    <td>{item.skills}</td>
                    <td>{item.location}</td>
                    <td>{item.teachingStatus}</td>
                </tr>
            ))}

        </tr>
    </tbody>
  </table>
}