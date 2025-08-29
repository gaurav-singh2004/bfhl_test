const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send("BFHL V2 API is running!");
});

app.post('/bfhl', (req, res) => {
    try {
        const { data, full_name, dob, email, roll_number } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid request: 'data' field must be an array."
            });
        }
        if (!full_name || !dob || !email || !roll_number) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid request: 'full_name', 'dob', 'email', and 'roll_number' are required."
            });
        }
        const user_id = `${full_name.toLowerCase().replace(/\s+/g, '_')}_${dob}`;

        let odd_numbers = [];
        let even_numbers = [];
        let alphabets = [];
        let special_characters = [];
        let sum = 0;
        let alphabet_chars_for_concat = [];

        data.forEach(item => {
            if (!isNaN(item) && !isNaN(parseFloat(item))) {
                const num = parseInt(item, 10);
                sum += num; 
                if (num % 2 === 0) {
                    even_numbers.push(item.toString());
                } else {
                    odd_numbers.push(item.toString());
                }
            } 
            else if (typeof item === 'string' && /^[a-zA-Z]+$/.test(item)) {
                alphabets.push(item.toUpperCase()); 
                for (const char of item) {
                    alphabet_chars_for_concat.push(char);
                }
            } 
            else {
                special_characters.push(item);
            }
        });

        const reversed_chars = alphabet_chars_for_concat.reverse();
        const concat_string = reversed_chars.map((char, index) => {
            return index % 2 === 0 ? char.toUpperCase() : char.toLowerCase();
        }).join('');

        const response = {
            is_success: true,
            user_id: user_id,
            email: email,
            roll_number: roll_number,
            odd_numbers: odd_numbers,
            even_numbers: even_numbers,
            alphabets: alphabets,
            special_characters: special_characters,
            sum: sum.toString(), 
            concat_string: concat_string,
        };
        
        // successful response with a 200 OK status.
        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
            is_success: false,
            error: `An internal server error occurred: ${error.message}`
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is successfully running on port ${PORT}`);
});