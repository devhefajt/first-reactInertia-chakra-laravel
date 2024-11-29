import React from "react";
import { Flex, Heading, Spacer, Button } from "@chakra-ui/react";
import { Link } from '@inertiajs/react';

const HeaderLayout = () => {
    return (
        <Flex bg="blue.600" color="white" p="4" align="center">
            <Heading size="lg">Admin Dashboard</Heading>
            <Spacer />
            <Button colorScheme="teal" variant="outline">
                <Link
                    href="/logout"
                    method="post"
                    _hover={{ color: "gray.200" }}
                >
                    Logout
                </Link>
            </Button>
        </Flex>
    );
};

export default HeaderLayout;
