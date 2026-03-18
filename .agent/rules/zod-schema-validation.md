---
trigger: always_on
---

All external data, including form submissions and API responses, must be validated using Zod on the frontend side ALLWAYS. This ensures that the application only processes data that strictly conforms to expected structures.

On the next app you should use the useCustomForm hook in ANY FORM
Folder structure for forms:

validations.ts:
Declate her
1.Interfaces for the form
2. Initial values object
3. getInitalValues function
4. Yup validations
