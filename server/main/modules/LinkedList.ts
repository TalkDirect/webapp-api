export class LinkedList<T> {
    head:LL_Node<T> | null = null;

    constructor(data:T) {
        this.head = new LL_Node<T>(data, null);
    }

    // Function that insert a new Node at linked_list head
    private insertAtHead(data: T) {
        const node = new LL_Node<T>(data, null);
        if (this.head == null) {
            this.head = node;
            return;
        }
        node.next = this.head;
        this.head = node;
    }

    private retrieveAtHead() {
        if (this.head == null) {
            return;
        }
        const targetNode = this.head;
        this.head = targetNode.next;
        return targetNode;
    }
    
    // Retrieve Node at End of LL
    private retrieveAtEnd() {
        if (this.head == null) {
            return;
        }
        if (this.head.next == null) {
            const curr = this.head;
            this.head.next = null;
            return curr;
        }
        let curr:LL_Node<T> = this.head;
		while (curr.next!.next != null)
		{
			curr = curr.next!;
		}
		curr.next = null;
		return curr;
    }

    public append(data:T) {
        this.insertAtHead(data);
    }

    public pop() {
        return this.retrieveAtEnd();
    }

    public isEmpty() {
        return this.head == null;
    }

    public toString() {
        let curr = this.head;
        let string = "head ->";
        if (curr == null) { return;}

        if (curr.next == null) {
            return string + " " + curr.data;
        }
        do {
            const data = curr?.data;
            string = string + " " + data + " -> ";
            curr = curr!.next;
            
        } while(curr!.next != null)
        return string;
    }

    public toArray() {
        if (this.head == null) return;
        let array: T[] = [];
        do {
            array.push(this.retrieveAtEnd()!.data!);
        } while(this.head)

        console.log(array);
        return array
    }

}

export class LL_Node<T> {
    data:T | null;
    next:LL_Node<T> | null = null;

    constructor(data:T | null, next:LL_Node<T> | null) {
        this.data = data;
        this.next = next;
    }
}