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
} from "@chakra-ui/react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Configs() {
    const [configs, setConfigs] = useState({})
    const [isLoading, setIsLoading] = useState(false)

//search and count state
const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [counter, setCounter] = useState(0);

const skillOptions = ["Angular","CSS","Graphic Design","Ember","HTML","Information Architecture",
        "Javascript","Mechanical Engineering","Meteor","NodeJS","Plumbing","Python","Rails","React",
        "Kitchen Repair","Ruby","UI Design","User Experience", "C", "C++"
      ]

    
    const handleChange = (e, meta = false) => {
        const {name, value, checked} = e.target;
        // let isChecked = checked ? 1 : 0
        if (meta) {
            return setConfigs((prev) => ({...prev, [name]: {...prev[name], ['meta']: value}}));
        }
        setConfigs((prev) => ({...prev, [name]: {...prev[name], ['value']: value || checked}}));

    }

    //search handle
    
    const handleSearchChange = (e) => {
        const text = e.target.value;
        setSearchText(text);

        if (text.trim() === "") {
            setSuggestions([]);
            return;
        }

        const filtered = skillOptions.filter(
            (skill) =>
                skill.toLowerCase().includes(text.toLowerCase()) &&
                !(configs?.unlocked_dev_shops?.meta || "").split(", ").includes(skill)
        );

        setSuggestions(filtered);
    };

 
    // Add skill to the meta string
    const handleSelectSkill = (skill) => {
        const currentMeta = configs?.unlocked_dev_shops?.meta || "";
        const updatedMeta = currentMeta ? `${currentMeta}, ${skill}` : skill;
        setConfigs((prev) => ({
            ...prev,
            unlocked_dev_shops: { ...prev.unlocked_dev_shops, meta: updatedMeta },
        }));

        const updatedCount = updatedMeta.split(", ").length;
        setCounter(updatedCount);

        setSearchText("");
        setSuggestions([]);
    };


    // Remove skill from the meta string
    const handleRemoveSkill = (skill) => {
        const currentMeta = configs?.unlocked_dev_shops?.meta || "";
        const updatedMeta = currentMeta
            .split(", ")
            .filter((item) => item !== skill)
            .join(", ");
        setConfigs((prev) => ({
            ...prev,
            unlocked_dev_shops: { ...prev.unlocked_dev_shops, meta: updatedMeta },
        }));

        const updatedCount = updatedMeta ? updatedMeta.split(", ").length : 0;
        setCounter(updatedCount);
    };

 
    const getList = async () => {
        setIsLoading(true);
        axios.get("/api/get-list").then((res) => {
            if (res?.status === 200) {
                const {configs} = res?.data
                let customConfigs = {}
                configs.map(config => {
                    if (config.key === 'enable_order_limit_popup') {
                        customConfigs[config.key] = config?.meta.length > 0 ? {...config, meta: config.meta.join(', ')} : {...config};
                    }
                    if (config.key === 'enable_view_limit_popup') {
                        customConfigs[config.key] = config?.meta.length > 0 ? {...config, meta: config.meta.join(', ')} : {...config};
                    }
                    if (config.key === 'enable_profile_limit_popup') {
                        customConfigs[config.key] = config?.meta.length > 0 ? {...config, meta: config.meta.join(', ')} : {...config};
                    }
                    if (config.key === 'unlocked_dev_shops') {
                        customConfigs[config.key] = config?.meta.length > 0 ? {...config, meta: config.meta.join(', ')} : {...config};
                    }
                    else {
                        customConfigs[config.key] = {...config};
                    }
                    delete customConfigs[config.key].key;
                })
                setConfigs(customConfigs);
            }
        }).finally(() => setIsLoading(false));
    };

    const saveConfig = () => {
        setIsLoading(true);
        axios.put("/api/authorize-routes", configs
        ).then((res) => {
            if (res?.status === 200) {
                toast.success(res?.data?.message);
            }
        }).finally(() => setIsLoading(false));
    };


    useEffect(() => {
        index();
        return index.cancel;
    }, []);

    const index = useCallback(() => getList(), [])


    // Render skill badges
    const renderSkillBadges = () => {
        const selectedSkills = (configs?.unlocked_dev_shops?.meta || "")
            .split(", ")
            .filter((skill) => skill);

        return (
            <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                {selectedSkills.map((skill, index) => (
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
                        <span>{skill}</span>
                        <Button
                            ml={2}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveSkill(skill)}
                        >
                            &times;
                        </Button>
                    </Box>
                ))}
            </Box>
        );
    };

    return (<AdminMasterLayout>
        <Center>
            <Box
                borderRadius={"10px"}
                bg={"white"}
                padding={{base: "10px", md: "20px"}}
                margin={{base: "10px", md: 0}}
                style={{boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px"}}
                width={520}
                minHeight={{base: "auto", md: 600}}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
            >
                <Box>
                    <Box border="1px" borderColor='gray.200' padding={5}
                         borderRadius={"10px"}>
                        <FormControl display='flex' alignItems='center' mb='2'>
                            <FormLabel htmlFor='enable_order_limit_popup'>
                                Enable Order Limit Popup?
                            </FormLabel>
                            <Switch
                                id='enable_order_limit_popup'
                                name="enable_order_limit_popup"
                                className="ml-auto"
                                isChecked={configs?.enable_order_limit_popup?.value == 1}
                                onChange={handleChange}
                            />
                        </FormControl>
                        {configs?.enable_order_limit_popup?.value == 1 && <FormControl htmlFor='shops'>
                            <Textarea placeholder='Shops that are except to show popup alerts'
                                      value={configs?.enable_order_limit_popup?.meta || ''}
                                      id="shops"
                                      name="enable_order_limit_popup"
                                      onChange={(e) => handleChange(e, true)}/>
                            <FormHelperText fontSize='sm'>Write comma separated shop urls here. For single entry keep as it
                                is.</FormHelperText>
                        </FormControl>}
                    </Box>

                    {/*New box */}

                    <Box  mt="5" border="1px" borderColor='gray.200' padding={5}
                         borderRadius={"10px"}>
                        <FormControl display='flex' alignItems='center' mb='2'>
                            <FormLabel htmlFor='enable_view_limit_popup'>
                                Enable View Limit Popup?
                            </FormLabel>
                            <Switch
                                id='enable_view_limit_popup'
                                name="enable_view_limit_popup"
                                className="ml-auto"
                                isChecked={configs?.enable_view_limit_popup?.value == 1}
                                onChange={handleChange}
                            />
                        </FormControl>
                        {configs?.enable_view_limit_popup?.value == 1 && <FormControl htmlFor='shops'>
                            <Textarea placeholder='Shops that are except to show popup alerts'
                                      value={configs?.enable_view_limit_popup?.meta || ''}
                                      id="shops"
                                      name="enable_view_limit_popup"
                                      onChange={(e) => handleChange(e, true)}/>
                            <FormHelperText fontSize='sm'>Write comma separated shop urls here. For single entry keep as it
                                is.</FormHelperText>
                        </FormControl>}
                    </Box>

                    {/*New box */}
                    
                    <Box mt="5" border="1px" borderColor='gray.200' padding={5}
                         borderRadius={"10px"}>
                        <FormControl display='flex' alignItems='center' mb='2'>
                            <FormLabel htmlFor='enable_profile_limit_popup'>
                                Enable Profile Limit Popup?
                            </FormLabel>
                            <Switch
                                id='enable_profile_limit_popup'
                                name="enable_profile_limit_popup"
                                className="ml-auto"
                                isChecked={configs?.enable_profile_limit_popup?.value == 1}
                                onChange={handleChange}
                            />
                        </FormControl>
                        {configs?.enable_profile_limit_popup?.value == 1 && <FormControl htmlFor='shops'>
                            <Textarea placeholder='Shops that are except to show popup alerts'
                                      value={configs?.enable_profile_limit_popup?.meta || ''}
                                      id="shops"
                                      name="enable_profile_limit_popup"
                                      onChange={(e) => handleChange(e, true)}/>
                            <FormHelperText fontSize='sm'>Write comma separated shop urls here. For single entry keep as it
                                is.</FormHelperText>
                        </FormControl>}
                    </Box>

                    {/*New box */}

                    <Box
                            mt="5"
                            border="1px"
                            borderColor="gray.200"
                            padding={5}
                            borderRadius={"10px"}
                        >
                        <FormControl display="flex" alignItems="center" mb="2">                         
                            <FormLabel htmlFor="unlocked_dev_shops">Unlocked Dev Shops?</FormLabel>
                                <Switch
                                    id="unlocked_dev_shops"
                                    name="unlocked_dev_shops"
                                    className="ml-auto"
                                    isChecked={configs?.unlocked_dev_shops?.value == 1}
                                    onChange={handleChange}
                                />
                            </FormControl>
                            {configs?.unlocked_dev_shops?.value == 1 && (
                            <FormControl>
                                {/* count skills */}
                                <span>Total Skills: {counter}</span>

                                    <Input
                                        placeholder="Search skills..."
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
                                            {suggestions.map((skill, index) => (
                                                <ListItem
                                                    key={index}
                                                    padding="8px"
                                                    cursor="pointer"
                                                    _hover={{ bg: "gray.100" }}
                                                    onClick={() => handleSelectSkill(skill)}
                                                >
                                                    {skill}
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}
                                    {renderSkillBadges()}
                                    <Textarea
                                        mt={4}
                                        placeholder="Shops that are except to show popup alerts"
                                        value={configs?.unlocked_dev_shops?.meta || ""}
                                        id="shops"
                                        name="unlocked_dev_shops"
                                        onChange={(e) => handleChange(e, true)}
                                        isReadOnly
                                    />
                                    <FormHelperText fontSize="sm">
                                        Write comma-separated shop URLs here. For single entry keep as it is.
                                    </FormHelperText>
                                </FormControl>
                            )}
                        </Box>
                </Box>

                <Button mt="4"
                        colorScheme="blue"
                        type="button"
                        onClick={saveConfig}
                        isDisabled={isLoading}
                >{isLoading ? <Spinner/> : 'Save'}</Button>

            </Box>
             </Center>
         </AdminMasterLayout>
    );
}

