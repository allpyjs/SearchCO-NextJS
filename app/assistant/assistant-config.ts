export let assistantId = "asst_NtKWY4Iro54VihiSlQQ2Adu8"; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
