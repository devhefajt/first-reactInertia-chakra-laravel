import React, { useState, useRef  } from "react";
import {
  Heading,
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  useToast,
} from "@chakra-ui/react";
import { Head, router } from "@inertiajs/react"; 
import AdminMasterLayout from "@/Layouts/AdminMasterLayout";
import axios from "axios";

const Create = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: null,
  });

  const [errors, setErrors] = useState({}); 
  const toast = useToast(); 

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear the specific error for this field
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined, // Remove the error for the current field
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

 
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    if (formData.image) data.append("image", formData.image);

    axios
      .post("/users/store", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setErrors({}); 


        toast({
          title: "Success!",
          description: "User created successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

        // Reset form data
        setFormData({
          name: "",
          email: "",
          image: null,
        });

        // Redirect to users page
        router.visit("/users");
      })
      .catch((error) => {
        if (error.response && error.response.data.errors) {
          // Capture validation errors
          setErrors(error.response.data.errors);
        }
      });
  };

  return (
    <AdminMasterLayout>
      <Head title="Create_User - Laravel+ReactInertia+Chakra" />

      <Heading bg="gray.700" p={2} borderRadius="md" color="white" mb={6}>
        Create User
      </Heading>

      <Box
        bg="gray.700"
        p={6}
        borderRadius="md"
        color="white"
        maxWidth="400px"
        mx="auto"
        boxShadow="lg"
      >
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <FormHelperText color="red.400">{errors.name}</FormHelperText>
            )}
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <FormHelperText color="red.400">{errors.email}</FormHelperText>
            )}
          </FormControl>

          <FormControl mb={6}>
            <FormLabel>Profile Image</FormLabel>
            <Input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
            <FormHelperText color="gray.400">
              Upload a profile picture (optional).
            </FormHelperText>
          </FormControl>

          <Button type="submit" colorScheme="teal" width="full">
            Submit
          </Button>
        </form>
      </Box>
    </AdminMasterLayout>
  );
};

export default Create;
