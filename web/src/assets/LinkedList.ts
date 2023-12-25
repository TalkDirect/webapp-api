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
    
    private retrieveAtEnd() {
        if (this.head == null) {
            return;
        }

        // this is pretty much a recursive fun, if true condition (statement after ?)
        const getLast = (node: LL_Node<T>): LL_Node<T> => {
            return node.next ? getLast(node.next) : node;
        }
        
        return getLast(this.head);
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

        /* some code i thought would work did not infact work.
        const toString = (curr:LL_Node<T>): string => {
            const data = curr?.data;
            string = string + " " + data + " -> ";
            return curr.next ? toString(curr.next) : string;
        }
        return toString;
        */
        return string;
    }

}

export class LL_Node<T> {
    data:T;
    next:LL_Node<T> | null = null;

    constructor(data:T, next:LL_Node<T> | null) {
        this.data = data;
        this.next = next;
    }
}