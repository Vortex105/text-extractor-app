const userFile = document.getElementById('userFile');
const userSelect = document.getElementById('userSelect');
const displayName = document.getElementById('fileName');
const copyBtn = document.getElementById('copyBtn');
const copyStatus = document.getElementById('copyStatus');
const displayText = document.getElementById('displayText');
const backBtn = document.getElementById('backBtn');
const loader = document.getElementById('loader');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

userFile.addEventListener('change', async (e) => {
	loader.classList.remove('hidden');
	loader.classList.add('flex');
	e.preventDefault();
	const file = e.target.files[0];

	if (!file) {
		alert('Please select a pdf file to upload');
		return;
	}

	if (file.size > MAX_FILE_SIZE) {
		alert(
			`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
		);
		userFile.value = '';
		loader.classList.add('hidden');
		loader.classList.remove('flex');
		return;
	}

	// A formdata to send the file to backend
	const formdata = new FormData();
	formdata.append('file', file);

	try {
		// POST request to flask
		const response = await fetch('http://localhost:5000/upload', {
			method: 'POST',
			body: formdata,
		});
		if (response.ok) {
			const data = await response.json();
			displayText.classList.remove('hidden');
			userSelect.classList.add('hidden');
			displayText.innerHTML = `<pre><code style="text-wrap: wrap;">${data.text}</code></pre>`;
			displayName.classList.remove('hidden');
			displayName.textContent = file.name || 'No file selected';
			copyBtn.classList.remove('hidden');
			backBtn.classList.remove('!hidden');
			copyBtn.classList.add('flex');
		} else {
			const errorData = await response.json();
			displayText.classList.remove('hidden');
			userSelect.classList.add('hidden');
			displayText.textContent = `Error: ${errorData.error}`;
		}
	} catch (error) {
		console.error(`Error uploading file: ${error}`);
		displayText.classList.remove('hidden');
		userSelect.classList.add('hidden');
		displayText.textContent = `An error occured while uploading the file.`;
	}

	loader.classList.remove('flex');
	loader.classList.add('hidden');
});

// Drag and drop event
userSelect.addEventListener('dragover', (e) => {
	e.preventDefault();
	userSelect.classList.remove('bg-gray-900');
	userSelect.classList.add('bg-gray-700');
});

userSelect.addEventListener('dragleave', (e) => {
	e.preventDefault();
	userSelect.classList.add('bg-gray-900');
	userSelect.classList.remove('bg-gray-700');
});

userSelect.addEventListener('drop', (e) => {
	e.preventDefault();

	const file = e.dataTransfer.files[0];
	if (file) {
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);
		userFile.files = dataTransfer.files;
	}

	// Manually trigger change event
	const changeEvent = new Event('change');
	userFile.dispatchEvent(changeEvent);
});

copyBtn.addEventListener('click', () => {
	try {
		navigator.clipboard.writeText(displayText.textContent);
		copyStatus.textContent = 'Copied!';
		setTimeout(() => {
			copyStatus.textContent = 'Copy Text';
		}, 2000);
	} catch (err) {
		console.error('Failed to copy: ', err);
		copyStatus.textContent = 'Failed to copy';
	}
});

backBtn.addEventListener('click', () => {
	userFile.value = '';
	displayName.classList.add('hidden');
	displayText.classList.add('hidden');
	displayText.classList.remove('flex');
	userSelect.classList.add('flex');
	userSelect.classList.remove('hidden');
	copyBtn.classList.add('hidden');
	backBtn.classList.add('!hidden');
	copyBtn.classList.remove('flex');
	userSelect.classList.add('bg-gray-900');
	userSelect.classList.remove('bg-gray-700');
});
