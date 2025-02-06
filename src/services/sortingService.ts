// src/services/sortingService.ts
export const sortingStrategies = {
    // Quick Sort
    quick: (arr: number[]): number[] => {
      if (arr.length <= 1) return arr;
      const pivot = arr[Math.floor(arr.length / 2)];
      const left = [];
      const right = [];
      
      const rest = arr.slice(0, Math.floor(arr.length / 2))
        .concat(arr.slice(Math.floor(arr.length / 2) + 1));
      for (const num of rest) {
        num < pivot ? left.push(num) : right.push(num);
      }
      return [...sortingStrategies.quick(left), pivot, ...sortingStrategies.quick(right)];
    },
  
    // Merge Sort
    merge: (arr: number[]): number[] => {
      const merge = (left: number[], right: number[]) => {
        const result = [];
        while (left.length && right.length) {
          left[0] < right[0] ? result.push(left.shift()!) : result.push(right.shift()!);
        }
        return [...result, ...left, ...right];
      };
      if (arr.length <= 1) return arr;
      const mid = Math.floor(arr.length / 2);
      return merge(
        sortingStrategies.merge(arr.slice(0, mid)),
        sortingStrategies.merge(arr.slice(mid))
      );
    },
  
    // Radix Sort
    radix: (arr: number[]): number[] => {
      const getMax = () => Math.max(...arr.map(num => Math.abs(num)));
      const digitCount = (num: number) => num === 0 ? 1 : Math.floor(Math.log10(Math.abs(num))) + 1;
      
      const maxDigits = digitCount(getMax());
      for (let i = 0; i < maxDigits; i++) {
        const buckets: number[][] = Array.from({ length: 10 }, () => []);
        for (const num of arr) {
          const digit = Math.floor(Math.abs(num) / Math.pow(10, i)) % 10;
          buckets[digit].push(num);
        }
        arr = buckets.flat();
      }
      return arr;
    },
  
    // Tim Sort
    tim: (arr: number[]): number[] => {
      const RUN = 32;
      const insertionSort = (arr: number[], left: number, right: number) => {
        for (let i = left + 1; i <= right; i++) {
          const temp = arr[i];
          let j = i - 1;
          while (j >= left && arr[j] > temp) {
            arr[j + 1] = arr[j];
            j--;
          }
          arr[j + 1] = temp;
        }
      };
  
      const merge = (arr: number[], l: number, m: number, r: number) => {
        const len1 = m - l + 1, len2 = r - m;
        const left = arr.slice(l, l + len1);
        const right = arr.slice(m + 1, m + 1 + len2);
        
        let i = 0, j = 0, k = l;
        while (i < len1 && j < len2) {
          if (left[i] <= right[j]) {
            arr[k] = left[i];
            i++;
          } else {
            arr[k] = right[j];
            j++;
          }
          k++;
        }
        while (i < len1) arr[k++] = left[i++];
        while (j < len2) arr[k++] = right[j++];
      };
  
      const n = arr.length;
      for (let i = 0; i < n; i += RUN) {
        insertionSort(arr, i, Math.min(i + RUN - 1, n - 1));
      }
  
      for (let size = RUN; size < n; size = 2 * size) {
        for (let left = 0; left < n; left += 2 * size) {
          const mid = left + size - 1;
          const right = Math.min(left + 2 * size - 1, n - 1);
          merge(arr, left, mid, right);
        }
      }
      return arr;
    },
  
    // Heap Sort
    heap: (arr: number[]): number[] => {
      const heapify = (n: number, i: number) => {
        let largest = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
  
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        
        if (largest !== i) {
          [arr[i], arr[largest]] = [arr[largest], arr[i]];
          heapify(n, largest);
        }
      };
  
      const n = arr.length;
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
      for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(i, 0);
      }
      return arr;
    },
  
    // Counting Sort
    counting: (arr: number[]): number[] => {
      const max = Math.max(...arr);
      const min = Math.min(...arr);
      const count = new Array(max - min + 1).fill(0);
      const output = new Array(arr.length);
  
      for (const num of arr) count[num - min]++;
      for (let i = 1; i < count.length; i++) count[i] += count[i - 1];
      for (let i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
      }
      return output;
    },
  
    // Bubble Sort
    bubble: (arr: number[]): number[] => {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          }
        }
      }
      return arr;
    },
  
    // Insertion Sort
    insertion: (arr: number[]): number[] => {
      for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = key;
      }
      return arr;
    },
  
    // Bucket Sort
    bucket: (arr: number[]): number[] => {
      const bucketSize = 5;
      const minVal = Math.min(...arr);
      const maxVal = Math.max(...arr);
      const bucketCount = Math.floor((maxVal - minVal) / bucketSize) + 1;
      const buckets = Array.from({ length: bucketCount }, () => []);
  
      for (const num of arr) {
        const index = Math.floor((num - minVal) / bucketSize);
        buckets[index].push(num);
      }
  
      return buckets.reduce((acc, bucket) =>
        [...acc, ...bucket.sort((a, b) => a - b)], []);
    }
  };
  
  //checking arrry if or not
  export const checkIfNearlySorted = (arr: number[], threshold = 100): boolean => {
    let disorder = 0;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i - 1] > arr[i]) disorder++;
      if (disorder > threshold) return false;
    }
    return true;
  };
  
  // functions that choosing arry as proprty 
  export const autoSelectAlgorithm = (data: number[]): keyof typeof sortingStrategies => {
    const isIntegerArray = data.every(num => Number.isInteger(num));
    const maxVal = Math.max(...data.map(Math.abs));
    
    if (isIntegerArray) {
      if (maxVal < 1000) return 'counting';
      if (maxVal < 1000000) return 'radix';
    }
    
    if (data.length < 50) return 'insertion';
    if (checkIfNearlySorted(data)) return 'tim';
    if (data.length > 1000000) return 'merge';
    
    return 'quick';
  };
  
  // endpoint /analyze
  export const checkIfSorted = (arr: number[]): boolean => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i - 1] > arr[i]) return false;
    }
    return true;
  };
  
  export const suggestAlgorithms = (data: number[]): string[] => {
    const suggestions = new Set<string>();
    
    if (data.length <= 1000) suggestions.add('insertion');
    if (checkIfNearlySorted(data)) suggestions.add('tim');
    if (Math.max(...data) < 1000) suggestions.add('counting');
    if (data.length > 1e6) suggestions.add('merge').add('radix');
    
    return Array.from(suggestions);
  };
  