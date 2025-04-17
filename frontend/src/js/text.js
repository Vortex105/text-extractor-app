const userFile = document.getElementById('userFile');
const userSelect = document.getElementById('userSelect');
const displayName = document.getElementById('fileName');
const copyBtn = document.getElementById('copyBtn');
const copyStatus = document.getElementById('copyStatus');
const displayText = document.getElementById('displayText');
const backBtn = document.getElementById('backBtn');
const loader = document.getElementById('loader');

userFile.addEventListener('change', (e) => {
	loader.classList.remove('hidden');
	loader.classList.add('flex');
	const file = e.target.files[0];

	if (!file.type.match('text/.*')) {
		alert('Please select a text file');
		userSelect.classList.remove('bg-gray-700');
		return;
	}

	const maxSize = 1 * 1024 * 1024;

	if (file.size > maxSize) {
		alert('File is too large. Maximum size is 1MB');
		userFile.value = '';
		userSelect.classList.remove('bg-gray-700');
		return;
	}
	const reader = new FileReader();

	reader.onload = () => {
		const fileContent = reader.result;
		displayName.classList.remove('hidden');
		displayName.textContent = file.name || 'No file selected';
		displayText.classList.remove('hidden');
		displayText.classList.add('flex');
		displayText.innerHTML = `<pre><code style="text-wrap: wrap;">${fileContent}</code></pre>`;
		userSelect.classList.remove('flex');
		userSelect.classList.add('hidden');
		copyBtn.classList.remove('hidden');
		backBtn.classList.remove('!hidden');
		copyBtn.classList.add('flex');
	};

	reader.readAsText(file);
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
