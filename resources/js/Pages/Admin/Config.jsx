import React, { useCallback, useEffect, useState } from "react";
import AdminMasterLayout from "@/Layouts/AdminMasterLayout";
import {
    Box,
    Button,
    Center,
    FormControl,
    FormHelperText,
    FormLabel,
    Spinner,
    Switch,
    Textarea,
    Input,
    List,
    ListItem,
    Select,
} from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Configs() {
    const [configs, setConfigs] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    //search and count state
    const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [counter, setCounter] = useState(0);

    //
    const [selectedOption, setSelectedOption] = useState("");

    const SHOPIFY_SCOPES = [
        "read_products",
        "write_products",
        "read_assigned_fulfillment_orders",
        "write_assigned_fulfillment_orders",
        "read_checkouts",
        "write_checkouts",
        "read_content",
        "write_content",
        "read_customers",
        "write_customers",
        "read_discounts",
        "write_discounts",
        "read_draft_orders",
        "write_draft_orders",
        "read_files",
        "write_files",
        "read_fulfillments",
        "write_fulfillments",
        "read_gift_cards",
        "write_gift_cards",
        "read_inventory",
        "write_inventory",
        "read_legal_policies",
        "read_locations",
        "read_merchant_managed_fulfillment_orders",
        "write_merchant_managed_fulfillment_orders",
        "read_orders",
        "write_orders",
        "read_price_rules",
        "write_price_rules",
        "read_product_listings",
        "read_third_party_fulfillment_orders",
        "write_third_party_fulfillment_orders",
        "read_themes",
        "write_themes",
        "read_markets",
        "write_markets",
        "unauthenticated_read_product_listings",
        "read_publications",
        "write_publications",
        "write_pixels",
        "read_customer_events",
        "unauthenticated_read_product_inventory",
        "read_shipping",
        "write_shipping",
        "write_order_edits",
        "read_order_edits",
    ];

    const ORDER_LIMIT_POPUP_OPTIONS = [
        "enable_order_limit_popup",
        "disable_order_limit_popup",
        "customize_order_limit_popup_message",
        "set_order_limit_threshold",
        "enable_popup_for_guest_users",
        "enable_popup_for_logged_in_users",
        "restrict_popup_based_on_location",
        "enable_popup_on_desktop",
        "enable_popup_on_mobile",
        "enable_popup_notifications",
        "log_order_limit_popup_events",
        "disable_order_limit_popup_snooze",
        "enable_popup_with_timer",
        "configure_popup_button_actions",
        "track_order_limit_popup_interactions",
        "enable_sound_on_popup",
        "disable_sound_on_popup",
        "set_popup_display_duration",
        "sync_popup_with_cart_updates",
        "enable_popup_for_specific_categories",
        "enable_popup_for_specific_products",
    ];

    const BLOCKED_SHOPS_OPTIONS = [
        "block_shop_for_guest_users",
        "block_shop_for_logged_in_users",
        "restrict_shop_access_by_location",
        "block_shop_on_desktop",
        "block_shop_on_mobile",
        "enable_block_shop_notifications",
        "disable_block_shop_notifications",
        "log_blocked_shop_access_attempts",
        "allow_admin_override_for_blocked_shops",
        "block_shop_by_ip_address",
        "block_shop_by_user_role",
        "block_shop_during_maintenance_mode",
        "enable_temporary_shop_block",
        "schedule_shop_blocking",
        "block_shop_for_specific_categories",
        "block_shop_for_specific_products",
        "track_blocked_shop_visits",
        "enable_popup_for_blocked_shops",
        "sync_block_shop_with_inventory",
        "configure_block_shop_messages",
    ];

    const handleChange = (e, meta = false) => {
        const { name, value, checked } = e.target;
        // let isChecked = checked ? 1 : 0
        if (meta) {
            return setConfigs((prev) => ({
                ...prev,
                [name]: { ...prev[name], ["meta"]: value },
            }));
        }
        setConfigs((prev) => ({
            ...prev,
            [name]: { ...prev[name], ["value"]: value || checked },
        }));
    };

    // Search handle
    const handleSearchChange = (e) => {
        const text = e.target.value;
        setSearchText(text);

        if (text.trim() === "") {
            setSuggestions([]);
            return;
        }

        const filtered = SHOPIFY_SCOPES.filter(
            (scope) =>
                scope.toLowerCase().includes(text.toLowerCase()) &&
                !(configs?.unlocked_dev_shops?.meta || "")
                    .split(", ")
                    .includes(scope)
        );

        setSuggestions(filtered);
    };

    // Add scope to the meta string
    const handleSelectScope = (scope) => {
        const currentMeta = configs?.unlocked_dev_shops?.meta || "";
        const updatedMeta = currentMeta ? `${currentMeta}, ${scope}` : scope;

        setConfigs((prev) => ({
            ...prev,
            unlocked_dev_shops: {
                ...prev.unlocked_dev_shops,
                meta: updatedMeta,
            },
        }));

        const updatedScopeCount = updatedMeta
            .split(",")
            .filter((scope) => scope.trim() !== "").length;
        setCounter(updatedScopeCount);

        setSearchText("");
        setSuggestions([]);
    };

    // Remove scope from the meta string
    const handleRemoveScope = (scope) => {
        const currentMeta = configs?.unlocked_dev_shops?.meta || "";
        const updatedMeta = currentMeta
            .split(",")
            .filter((item) => item.trim() !== scope.trim())
            .join(", ");

        setConfigs((prev) => ({
            ...prev,
            unlocked_dev_shops: {
                ...prev.unlocked_dev_shops,
                meta: updatedMeta,
            },
        }));

        const updatedScopeCount = updatedMeta
            .split(",")
            .filter((scope) => scope.trim() !== "").length;
        setCounter(updatedScopeCount);
    };

    const getList = async () => {
        setIsLoading(true);
        axios
            .get("/api/get-list")
            .then((res) => {
                if (res?.status === 200) {
                    const configs = res?.data?.configs;
                    let customConfigs = {};
                    configs?.map((config) => {
                        if (
                            config.key === "enable_order_limit_popup" ||
                            config.key === "blocked_shopes" ||
                            config.key === "unlocked_dev_shops"
                        ) {
                            customConfigs[config.key] =
                                config?.meta.length > 0
                                    ? {
                                          ...config,
                                          meta: config.meta.join(", "),
                                      }
                                    : { ...config };
                        } else {
                            customConfigs[config.key] = { ...config };
                        }
                    });

                    setConfigs(customConfigs);

                    const unlockedDevShopsMeta =
                        customConfigs?.unlocked_dev_shops?.meta || "";
                    const initialScopeCount = unlockedDevShopsMeta
                        .split(",")
                        .filter((scope) => scope.trim() !== "").length;
                    setCounter(initialScopeCount);
                }
            })
            .finally(() => setIsLoading(false));
    };

    const saveConfig = () => {
        setIsLoading(true);
        axios
            .put("/api/authorize-routes", configs)
            .then((res) => {
                if (res?.status === 200) {
                    toast.success(res?.data?.message);
                }
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        index();
        return index.cancel;
    }, []);

    const index = useCallback(() => getList(), []);

    // Render scopes badges
    const renderScopeBadges = () => {
        const selectedScopes = (configs?.unlocked_dev_shops?.meta || "")
            .split(", ")
            .filter((scope) => scope);

        return (
            <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                {selectedScopes.map((scope, index) => (
                    <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        bg="blue.100"
                        px={3}
                        py={1}
                        borderRadius="md"
                        boxShadow="sm"
                    >
                        <span>{scope}</span>
                        <Button
                            ml={2}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveScope(scope)}
                        >
                            &times;
                        </Button>
                    </Box>
                ))}
            </Box>
        );
    };

    return (
        <AdminMasterLayout>
            <Center>
                <Box
                    borderRadius={"10px"}
                    bg={"white"}
                    padding={{ base: "10px", md: "20px" }}
                    margin={{ base: "10px", md: 0 }}
                    style={{
                        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                    }}
                    width={520}
                    minHeight={{ base: "auto", md: 600 }}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                >
                    <Box>
                        <Box
                            border="1px"
                            borderColor="gray.200"
                            padding={5}
                            borderRadius={"10px"}
                        >
                            <FormControl
                                display="flex"
                                alignItems="center"
                                mb="2"
                            >
                                <FormLabel htmlFor="enable_order_limit_popup">
                                    Enable Order Limit Popup?
                                </FormLabel>
                                <Switch
                                    id="enable_order_limit_popup"
                                    name="enable_order_limit_popup"
                                    className="ml-auto"
                                    isChecked={
                                        configs?.enable_order_limit_popup
                                            ?.value == 1
                                    }
                                    onChange={handleChange}
                                />
                            </FormControl>
                            {configs?.enable_order_limit_popup?.value == 1 && (
                                <FormControl htmlFor="shops">
                                    <Select
                                        placeholder="Select option"
                                        mb="4"
                                        onChange={handleChange}
                                    >
                                        {ORDER_LIMIT_POPUP_OPTIONS.map(
                                            (order, index) => (
                                                <option
                                                    key={index}
                                                    value={order}
                                                    onClick={() =>
                                                        handleSelectedOrderOption(
                                                            order
                                                        )
                                                    }
                                                >
                                                    {order}
                                                </option>
                                            )
                                        )}
                                    </Select>

                                    <Textarea
                                        placeholder="Shops that are except to show popup alerts"
                                        value={
                                            configs?.enable_order_limit_popup
                                                ?.meta || ""
                                        }
                                        id="shops"
                                        name="enable_order_limit_popup"
                                        onChange={(e) => handleChange(e, true)}
                                    />
                                    <FormHelperText fontSize="sm">
                                        Write comma separated shop urls here.
                                        For single entry keep as it is.
                                    </FormHelperText>
                                </FormControl>
                            )}
                        </Box>

                        {/*New box */}

                        <Box
                            mt="5"
                            border="1px"
                            borderColor="gray.200"
                            padding={5}
                            borderRadius={"10px"}
                        >
                            <FormControl
                                display="flex"
                                alignItems="center"
                                mb="2"
                            >
                                <FormLabel htmlFor="blocked_shopes">
                                    Blocked Shops?
                                </FormLabel>
                                <Switch
                                    id="blocked_shopes"
                                    name="blocked_shopes"
                                    className="ml-auto"
                                    isChecked={
                                        configs?.blocked_shopes?.value == 1
                                    }
                                    onChange={handleChange}
                                />
                            </FormControl>
                            {configs?.blocked_shopes?.value == 1 && (
                                <FormControl htmlFor="shops">
                                    <Select
                                        placeholder="Select option"
                                        mb="4"
                                        onChange={handleChange}
                                    >
                                        {BLOCKED_SHOPS_OPTIONS.map(
                                            (shop, index) => (
                                                <option
                                                    key={index}
                                                    value={shop}
                                                    onClick={() =>
                                                        handleSelectedShopOption(shop)
                                                    }
                                                >
                                                    {shop}
                                                </option>
                                            )
                                        )}
                                    </Select>

                                    <Textarea
                                        placeholder="Shops that are except to show popup alerts"
                                        value={
                                            configs?.blocked_shopes?.meta || ""
                                        }
                                        id="shops"
                                        name="blocked_shopes"
                                        onChange={(e) => handleChange(e, true)}
                                    />
                                    <FormHelperText fontSize="sm">
                                        Write comma separated shop urls here.
                                        For single entry keep as it is.
                                    </FormHelperText>
                                </FormControl>
                            )}
                        </Box>

                        {/*New box */}

                        <Box
                            mt="5"
                            border="1px"
                            borderColor="gray.200"
                            padding={5}
                            borderRadius={"10px"}
                        >
                            <FormControl
                                display="flex"
                                alignItems="center"
                                mb="2"
                            >
                                <FormLabel htmlFor="unlocked_dev_shops">
                                    Unlocked Dev Shops?
                                </FormLabel>
                                <Switch
                                    id="unlocked_dev_shops"
                                    name="unlocked_dev_shops"
                                    className="ml-auto"
                                    isChecked={
                                        configs?.unlocked_dev_shops?.value == 1
                                    }
                                    onChange={handleChange}
                                />
                            </FormControl>
                            {configs?.unlocked_dev_shops?.value == 1 && (
                                <FormControl>
                                    {/* count Scopes */}
                                    <span>Total Scopes: {counter}</span>

                                    <Input
                                        placeholder="Search scopes..."
                                        value={searchText}
                                        onChange={handleSearchChange}
                                    />
                                    {suggestions.length > 0 && (
                                        <List
                                            border="1px solid gray"
                                            borderRadius="md"
                                            mt={2}
                                            bg="white"
                                            boxShadow="md"
                                            zIndex={10}
                                        >
                                            {suggestions.map((scope, index) => (
                                                <ListItem
                                                    key={index}
                                                    multiple
                                                    padding="8px"
                                                    cursor="pointer"
                                                    _hover={{ bg: "gray.100" }}
                                                    onClick={() =>
                                                        handleSelectScope(scope)
                                                    }
                                                >
                                                    {scope}
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}
                                    {renderScopeBadges()}
                                    <Textarea
                                        mt="4"
                                        placeholder="Shops that are except to show popup alerts"
                                        value={
                                            configs?.unlocked_dev_shops?.meta ||
                                            ""
                                        }
                                        id="shops"
                                        name="unlocked_dev_shops"
                                        onChange={(e) => handleChange(e, true)}
                                        isReadOnly
                                    />
                                    {/* <FormHelperText fontSize="sm">
                                        Write comma-separated shop URLs here.
                                        For single entry keep as it is.
                                    </FormHelperText> */}
                                </FormControl>
                            )}
                        </Box>
                    </Box>

                    <Button
                        mt="4"
                        colorScheme="blue"
                        type="button"
                        onClick={saveConfig}
                        isDisabled={isLoading}
                    >
                        {isLoading ? <Spinner /> : "Save"}
                    </Button>
                </Box>
            </Center>
        </AdminMasterLayout>
    );
}
