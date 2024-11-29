// import React, { useState, useEffect } from "react";
// import { Box, Heading, Button } from "@chakra-ui/react";
// import AdminMasterLayout from "@/Layouts/AdminMasterLayout";
// import { Head } from "@inertiajs/react";
// import {
//   Table,
//   Thead,
//   Tbody,
//   Tfoot,
//   Tr,
//   Th,
//   Td,
//   TableCaption,
//   TableContainer,
// } from "@chakra-ui/react";
// import { Link } from "@inertiajs/react";
// import axios from "axios"; // Ensure axios is imported

// const User = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     // Fetch users data from API
//     axios
//       .get("/api/users")
//       .then((res) => {
//         // console.log("Response Data:", res.data); // Log the response data
//         setData(res.data);
//       })
//   }, []);

//   return (
//     <AdminMasterLayout>
//       <Head title="User - Laravel+ReactJS+Chakra" />

//       <Heading size="lg" mb={4}>
//         User
//       </Heading>

//       <Box display="flex" justifyContent="flex-end" mb={4}>
//         <Link href="/users/create">
//           <Button colorScheme="teal" variant="outline">
//             Add User
//           </Button>
//         </Link>
//       </Box>

//       <TableContainer>
//         <Table variant="striped" colorScheme="teal">
//           <TableCaption>List of Users</TableCaption>
//           <Thead>
//             <Tr>
//               <Th>Sl</Th>
//               <Th>Name</Th>
//               <Th>Email</Th>
//               <Th>Image</Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {data.length === 0 ? (
//               <Tr>
//                 <Td colSpan="4" textAlign="center">
//                   No users found.
//                 </Td>
//               </Tr>
//             ) : (
//               data.map((user, index) => (
//                 <Tr key={user.id}>
//                   <Td>{index + 1}</Td>
//                   <Td>{user.name}</Td>
//                   <Td>{user.email}</Td>
//                   <Td>
//                     {user.image ? (
//                       <img
//                         src={`/${user.image}`} // Assuming image path is relative
//                         alt={user.name}
//                         width={50}
//                         height={50}
//                         style={{ borderRadius: "50%" }}
//                       />
//                     ) : (
//                       "No Image"
//                     )}
//                   </Td>
//                 </Tr>
//               ))
//             )}
//           </Tbody>
//         </Table>
//       </TableContainer>
//     </AdminMasterLayout>
//   );
// };

// export default User;


import React, { useState, useEffect } from "react";
import { Box, Heading, Button } from "@chakra-ui/react";
import AdminMasterLayout from "@/Layouts/AdminMasterLayout";
import { Head } from "@inertiajs/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { Link } from "@inertiajs/react";
import axios from "axios";

const User = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({}); // For storing pagination info

  const fetchUsers = (page = 1) => {
    // Fetch users from the API with pagination
    axios
      .get(`/api/users?page=${page}`)
      .then((res) => {
        setData(res.data.data); // Get user data from the response
        setPagination(res.data); // Store pagination info
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  useEffect(() => {
    fetchUsers(); // Fetch users for the first page when the component mounts
  }, []);

  return (
    <AdminMasterLayout>
      <Head title="User - Laravel+ReactJS+Chakra" />

      <Heading size="lg" mb={4}>
        User
      </Heading>

      <Box display="flex" justifyContent="flex-end" mb={4}>
        <Link href="/users/create">
          <Button colorScheme="teal" variant="outline">
            Add User
          </Button>
        </Link>
      </Box>

      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <TableCaption>List of Users</TableCaption>
          <Thead>
            <Tr>
              <Th>Sl</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Image</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.length === 0 ? (
              <Tr>
                <Td colSpan="4" textAlign="center">
                  No users found.
                </Td>
              </Tr>
            ) : (
              data.map((user, index) => (
                <Tr key={user.id}>
                  <Td>{index + 1}</Td>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    {user.image ? (
                      <img
                        src={`/${user.image}`} 
                        alt={user.name}
                        width={80}
                        height={80}
                        
                      />
                    ) : (
                      "No Image"
                    )}
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box mt={4} display="flex" justifyContent="center">
        <Button
          onClick={() => fetchUsers(pagination.prev_page_url ? pagination.current_page - 1 : 1)}
          isDisabled={!pagination.prev_page_url}
          mr={2}
        >
          Previous
        </Button>
        <Button
          onClick={() => fetchUsers(pagination.next_page_url ? pagination.current_page + 1 : pagination.current_page)}
          isDisabled={!pagination.next_page_url}
        >
          Next
        </Button>
      </Box>
    </AdminMasterLayout>
  );
};

export default User;
