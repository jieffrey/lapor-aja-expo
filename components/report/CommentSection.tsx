import { useEffect, useRef, useState } from "react"
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import { MessageCircle, Send, User } from "lucide-react-native"
import api from "@/lib/api"
import { colors, fontFamily, fontSize, radius } from "@/lib/theme"

// Tipe data comment dari backend
type Comment = {
    id: string
    name: string
    comment: string
    created_at: string
}

type Props = {
    reportId: string | string[]
}

export default function CommentSection({ reportId }: Props) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [text, setText] = useState("")
    const inputRef = useRef<TextInput>(null)

    // Fetch semua comment saat komponen mount
    useEffect(() => {
        fetchComments()
    }, [reportId])

    const fetchComments = async () => {
        try {
            const res = await api.get(`/comments/report/${reportId}`)
            setComments(res.data.data ?? [])
        } catch (e) {
            console.error("Gagal fetch comments:", e)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        const trimmed = text.trim()
        if (!trimmed || submitting) return

        setSubmitting(true)
        try {
            const res = await api.post(`/comments`, {
                report_id: reportId,
                comment: trimmed,
            })
            setComments((prev) => [...prev, res.data.data])
            setText("")
            inputRef.current?.blur()
        } catch (e) {
            console.error("Gagal kirim comment:", e)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Section header */}
            <View style={styles.sectionHeader}>
                <MessageCircle size={16} color={colors.brand[500]} />
                <Text style={styles.sectionTitle}>
                    Komentar ({comments.length})
                </Text>
            </View>

            {/* List comments */}
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={colors.brand[500]}
                    style={{ marginVertical: 16 }}
                />
            ) : comments.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>
                        Belum ada komentar. Jadilah yang pertama!
                    </Text>
                </View>
            ) : (
                <View style={styles.commentList}>
                    {comments.map((c) => (
                        <CommentItem key={c.id} comment={c} />
                    ))}
                </View>
            )}

            {/* Input kirim comment */}
            <View style={styles.inputRow}>
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder="Tulis komentar..."
                    placeholderTextColor={colors.text.placeholder}
                    value={text}
                    onChangeText={setText}
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!text.trim() || submitting}
                    style={[
                        styles.sendBtn,
                        (!text.trim() || submitting) && styles.sendBtnDisabled,
                    ]}
                    activeOpacity={0.8}
                >
                    {submitting ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Send size={16} color="#fff" />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

// Sub-komponen untuk satu baris comment
function CommentItem({ comment }: { comment: Comment }) {
    // Format tanggal jadi "12 Juni 2025, 14:30"
    const date = new Date(comment.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })

    return (
        <View style={styles.commentItem}>
            {/* Avatar inisial */}
            <View style={styles.avatar}>
                <User size={14} color={colors.brand[500]} />
            </View>

            <View style={styles.commentBody}>
                <View style={styles.commentMeta}>
                    <Text style={styles.commentAuthor}>
                        {comment.name}
                    </Text>
                    <Text style={styles.commentDate}>{date}</Text>
                </View>
                <Text style={styles.commentContent}>{comment.comment}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.md,
        color: colors.text.primary,
    },
    empty: {
        paddingVertical: 20,
        alignItems: "center",
    },
    emptyText: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.sm,
        color: colors.text.placeholder,
    },
    commentList: {
        gap: 12,
        marginBottom: 16,
    },
    commentItem: {
        flexDirection: "row",
        gap: 10,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.brand[50],
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
    },
    commentBody: {
        flex: 1,
        backgroundColor: colors.cream[100],
        borderRadius: radius.md,
        padding: 10,
        borderWidth: 1,
        borderColor: colors.cream[300],
    },
    commentMeta: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    commentAuthor: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.xs,
        color: colors.text.primary,
    },
    commentDate: {
        fontFamily: fontFamily.regular,
        fontSize: 10,
        color: colors.text.placeholder,
    },
    commentContent: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.sm,
        color: colors.text.muted,
        lineHeight: 20,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 8,
        marginTop: 4,
    },
    input: {
        flex: 1,
        minHeight: 44,
        maxHeight: 120,
        backgroundColor: colors.cream[100],
        borderWidth: 1.5,
        borderColor: colors.cream[300],
        borderRadius: radius.md,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontFamily: fontFamily.regular,
        fontSize: fontSize.sm,
        color: colors.text.primary,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: radius.md,
        backgroundColor: colors.brand[500],
        justifyContent: "center",
        alignItems: "center",
    },
    sendBtnDisabled: {
        opacity: 0.4,
    },
})